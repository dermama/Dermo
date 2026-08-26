import { describe, expect, it } from "vitest";
import { sendConsultationApprovalEmail } from "./consultationEmail";

describe("consultation approval email", () => {
  it("does not attempt delivery until Resend credentials are configured", async () => {
    const previousKey = process.env.RESEND_API_KEY;
    const previousFrom = process.env.RESEND_FROM_EMAIL;
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
    const result = await sendConsultationApprovalEmail({
      recipientEmail: "ornek@example.com",
      recipientName: "Örnek Danışan",
      sessionId: 1,
      rawToken: "secure-test-token",
      expiresAt: new Date("2026-09-02T12:00:00.000Z"),
      appUrl: "https://dermamatch.example",
    });
    expect(result).toEqual({ sent: false, error: "E-posta gönderimi henüz yapılandırılmadı." });
    if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL; else process.env.RESEND_FROM_EMAIL = previousFrom;
  });
});
