import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  consultationApplications,
  consultationMessages,
  consultationSessions,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { createConsultationToken, dateSevenDaysFrom, hashOpaqueToken } from "./consultationSecurity";

const schema = { users, consultationApplications, consultationSessions, consultationMessages };
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance && ENV.databaseUrl) dbInstance = drizzle({ client: neon(ENV.databaseUrl), schema });
  if (!dbInstance) throw new Error("DATABASE_URL is required for database access");
  return dbInstance;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const values: InsertUser = {
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"),
    lastSignedIn: user.lastSignedIn ?? new Date(),
  };
  await getDb().insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: { name: values.name, email: values.email, loginMethod: values.loginMethod, role: values.role, lastSignedIn: values.lastSignedIn, updatedAt: new Date() },
  });
}

export async function getUserByOpenId(openId: string) {
  return (await getDb().select().from(users).where(eq(users.openId, openId)).limit(1))[0];
}

export async function createApplication(input: {
  fullName: string; email: string; consultationType: string; inquirySummary: string;
  consentVersion: string; careScopeAcceptedAt: Date; privacyAcceptedAt: Date;
}) {
  return (await getDb().insert(consultationApplications).values(input).returning())[0]!;
}

export async function getAdminApplications(status: "all" | "pending" | "approved" | "rejected" | "closed") {
  const db = getDb();
  if (status === "all") {
    return db.select({ application: consultationApplications, session: consultationSessions })
      .from(consultationApplications).leftJoin(consultationSessions, eq(consultationSessions.applicationId, consultationApplications.id))
      .orderBy(desc(consultationApplications.submittedAt));
  }
  return db.select({ application: consultationApplications, session: consultationSessions })
    .from(consultationApplications).leftJoin(consultationSessions, eq(consultationSessions.applicationId, consultationApplications.id))
    .where(eq(consultationApplications.status, status)).orderBy(desc(consultationApplications.submittedAt));
}

export async function getApplicationForAdmin(applicationId: number) {
  const row = (await getDb().select({ application: consultationApplications, session: consultationSessions })
    .from(consultationApplications).leftJoin(consultationSessions, eq(consultationSessions.applicationId, consultationApplications.id))
    .where(eq(consultationApplications.id, applicationId)).limit(1))[0];
  if (!row) return undefined;
  return { ...row, messages: row.session ? await getMessagesForSession(row.session.id) : [] };
}

export async function approveApplication(applicationId: number) {
  const db = getDb();
  const application = (await db.select().from(consultationApplications)
    .where(and(eq(consultationApplications.id, applicationId), eq(consultationApplications.status, "pending"))).limit(1))[0];
  if (!application) return undefined;
  const now = new Date();
  const rawToken = createConsultationToken();
  const session = (await db.insert(consultationSessions).values({
    applicationId, tokenHash: hashOpaqueToken(rawToken), expiresAt: dateSevenDaysFrom(now), approvedAt: now,
  }).returning())[0]!;
  const updated = (await db.update(consultationApplications).set({ status: "approved", decidedAt: now, updatedAt: now })
    .where(eq(consultationApplications.id, applicationId)).returning())[0]!;
  return { application: updated, session, rawToken };
}

export async function rejectApplication(applicationId: number) {
  return (await getDb().update(consultationApplications).set({ status: "rejected", decidedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(consultationApplications.id, applicationId), eq(consultationApplications.status, "pending"))).returning())[0];
}

export async function revokeSession(sessionId: number) {
  const db = getDb();
  const revokedAt = new Date();
  const session = (await db.update(consultationSessions).set({ revokedAt })
    .where(and(eq(consultationSessions.id, sessionId), isNull(consultationSessions.revokedAt))).returning())[0];
  if (session) await db.update(consultationApplications).set({ status: "closed", updatedAt: revokedAt })
    .where(eq(consultationApplications.id, session.applicationId));
  return session;
}

export async function updateSessionNotification(sessionId: number, status: "sent" | "failed", error: string | null) {
  await getDb().update(consultationSessions).set({ notificationStatus: status, notificationError: error?.slice(0, 500) ?? null })
    .where(eq(consultationSessions.id, sessionId));
}

export async function getActiveSessionByTokenHash(rawToken: string) {
  return (await getDb().select({ session: consultationSessions, application: consultationApplications })
    .from(consultationSessions).innerJoin(consultationApplications, eq(consultationApplications.id, consultationSessions.applicationId))
    .where(and(eq(consultationSessions.tokenHash, hashOpaqueToken(rawToken)), eq(consultationApplications.status, "approved"), isNull(consultationSessions.revokedAt), gt(consultationSessions.expiresAt, new Date())))
    .limit(1))[0];
}

export async function getMessagesForSession(sessionId: number) {
  return getDb().select().from(consultationMessages).where(eq(consultationMessages.sessionId, sessionId)).orderBy(asc(consultationMessages.createdAt));
}

export async function createMessage(input: { sessionId: number; sender: "client" | "admin"; content: string }) {
  return (await getDb().insert(consultationMessages).values(input).returning())[0]!;
}
