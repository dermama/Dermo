import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import {
  approveApplication, createApplication, createMessage, getActiveSessionByTokenHash, getAdminApplications,
  getApplicationForAdmin, getMessagesForSession, rejectApplication, revokeSession, updateSessionNotification,
} from "./db";
import { sendConsultationApprovalEmail } from "./consultationEmail";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, passwordsMatch, verifyAdminSessionToken } from "./consultationSecurity";
import { publicProcedure, router } from "./_core/trpc";

const consultationTypes = ["Rutin başlangıcı", "Rutin değerlendirmesi", "İçerik ve ürün okuması", "Mevsimsel bakım odağı"] as const;
const messageInput = z.string().trim().min(1).max(1600);

function getCookie(req: { headers: { cookie?: string | undefined } }, name: string) {
  return parseCookie(req.headers.cookie ?? "")[name];
}

async function assertAdmin(req: { headers: { cookie?: string | undefined } }) {
  if (!await verifyAdminSessionToken(getCookie(req, ADMIN_SESSION_COOKIE))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Yönetim alanı için oturum açmanız gerekir." });
  }
}

function adminCookieOptions(req: { protocol?: string; headers: { [key: string]: unknown } }) {
  const secure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/", maxAge: 12 * 60 * 60 * 1000 };
}

function publicAppUrl(req: { headers: { host?: string | undefined } }) {
  if (process.env.PUBLIC_APP_URL) return process.env.PUBLIC_APP_URL;
  if (req.headers.host) return `${process.env.NODE_ENV === "production" ? "https" : "http"}://${req.headers.host}`;
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Canlı site adresi yapılandırılmadı." });
}

export const consultationRouter = router({
  submit: publicProcedure.input(z.object({
    fullName: z.string().trim().min(2).max(120), email: z.string().trim().email().max(320),
    consultationType: z.enum(consultationTypes), inquirySummary: z.string().trim().min(8).max(900),
    careScopeAccepted: z.literal(true), privacyAccepted: z.literal(true),
  })).mutation(({ input }) => createApplication({
    fullName: input.fullName, email: input.email, consultationType: input.consultationType, inquirySummary: input.inquirySummary,
    careScopeAcceptedAt: new Date(), privacyAcceptedAt: new Date(), consentVersion: "v1.0-draft",
  })),

  session: router({
    get: publicProcedure.input(z.object({ token: z.string().min(40).max(180) })).query(async ({ input }) => {
      const resolved = await getActiveSessionByTokenHash(input.token);
      if (!resolved) throw new TRPCError({ code: "NOT_FOUND", message: "Bu görüşme bağlantısı geçerli değil, süresi dolmuş veya kapatılmış." });
      return {
        session: { id: resolved.session.id, expiresAt: resolved.session.expiresAt, consultationType: resolved.application.consultationType, firstName: resolved.application.fullName.split(" ")[0] ?? "" },
        messages: await getMessagesForSession(resolved.session.id),
      };
    }),
    sendMessage: publicProcedure.input(z.object({ token: z.string().min(40).max(180), content: messageInput })).mutation(async ({ input }) => {
      const resolved = await getActiveSessionByTokenHash(input.token);
      if (!resolved) throw new TRPCError({ code: "NOT_FOUND", message: "Bu görüşme alanı artık mesaj kabul etmiyor." });
      return createMessage({ sessionId: resolved.session.id, sender: "client", content: input.content });
    }),
  }),

  admin: router({
    status: publicProcedure.query(({ ctx }) => verifyAdminSessionToken(getCookie(ctx.req, ADMIN_SESSION_COOKIE)).then(authenticated => ({ authenticated }))),
    login: publicProcedure.input(z.object({ password: z.string().min(1).max(300) })).mutation(async ({ ctx, input }) => {
      const expectedPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
      if (!expectedPassword) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Yönetim erişimi yapılandırılmadı." });
      if (!passwordsMatch(input.password, expectedPassword)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Parola doğrulanamadı." });
      ctx.res.cookie(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), adminCookieOptions(ctx.req));
      return { authenticated: true };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...adminCookieOptions(ctx.req), maxAge: 0 });
      return { authenticated: false };
    }),
    list: publicProcedure.input(z.object({ status: z.enum(["all", "pending", "approved", "rejected", "closed"]).default("all") })).query(async ({ ctx, input }) => {
      await assertAdmin(ctx.req); return getAdminApplications(input.status);
    }),
    get: publicProcedure.input(z.object({ applicationId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      await assertAdmin(ctx.req); const application = await getApplicationForAdmin(input.applicationId);
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Başvuru bulunamadı." }); return application;
    }),
    approve: publicProcedure.input(z.object({ applicationId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await assertAdmin(ctx.req); const approval = await approveApplication(input.applicationId);
      if (!approval) throw new TRPCError({ code: "NOT_FOUND", message: "Başvuru bulunamadı veya işleme kapalı." });
      const delivery = await sendConsultationApprovalEmail({
        recipientEmail: approval.application.email, recipientName: approval.application.fullName, sessionId: approval.session.id,
        rawToken: approval.rawToken, expiresAt: approval.session.expiresAt, appUrl: publicAppUrl(ctx.req),
      });
      await updateSessionNotification(approval.session.id, delivery.sent ? "sent" : "failed", delivery.sent ? null : delivery.error);
      return { approved: true, emailSent: delivery.sent, emailError: delivery.sent ? null : delivery.error };
    }),
    reject: publicProcedure.input(z.object({ applicationId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await assertAdmin(ctx.req); if (!await rejectApplication(input.applicationId)) throw new TRPCError({ code: "NOT_FOUND", message: "Başvuru bulunamadı veya işleme kapalı." }); return { rejected: true };
    }),
    revoke: publicProcedure.input(z.object({ sessionId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await assertAdmin(ctx.req); if (!await revokeSession(input.sessionId)) throw new TRPCError({ code: "NOT_FOUND", message: "Görüşme oturumu bulunamadı." }); return { revoked: true };
    }),
    messages: publicProcedure.input(z.object({ sessionId: z.number().int().positive() })).query(async ({ ctx, input }) => { await assertAdmin(ctx.req); return getMessagesForSession(input.sessionId); }),
    sendMessage: publicProcedure.input(z.object({ sessionId: z.number().int().positive(), content: messageInput })).mutation(async ({ ctx, input }) => { await assertAdmin(ctx.req); return createMessage({ sessionId: input.sessionId, sender: "admin", content: input.content }); }),
  }),
});
