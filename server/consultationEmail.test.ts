import { afterEach, describe, expect, it, vi } from "vitest";

const smtp = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: { createTransport: smtp.createTransport },
}));

import { sendConsultationApprovalEmail } from "./consultationEmail";

describe("consultation approval email", () => {
  const originalUser = process.env.GMAIL_SMTP_USER;
  const originalAppPassword = process.env.GMAIL_SMTP_APP_PASSWORD;

  afterEach(() => {
    vi.clearAllMocks();
    if (originalUser === undefined) delete process.env.GMAIL_SMTP_USER; else process.env.GMAIL_SMTP_USER = originalUser;
    if (originalAppPassword === undefined) delete process.env.GMAIL_SMTP_APP_PASSWORD; else process.env.GMAIL_SMTP_APP_PASSWORD = originalAppPassword;
  });

  it("does not attempt delivery until Gmail SMTP credentials are configured", async () => {
    delete process.env.GMAIL_SMTP_USER;
    delete process.env.GMAIL_SMTP_APP_PASSWORD;
    const result = await sendConsultationApprovalEmail({
      recipientEmail: "ornek@example.com",
      recipientName: "Örnek Danışan",
      sessionId: 1,
      rawToken: "secure-test-token",
      expiresAt: new Date("2026-09-02T12:00:00.000Z"),
      appUrl: "https://dermamatch.example",
    });
    expect(result).toEqual({ sent: false, error: "Gmail e-posta gönderimi henüz yapılandırılmadı." });
    expect(smtp.createTransport).not.toHaveBeenCalled();
  });

  it("uses Gmail SMTP with an app password and sends the private consultation link", async () => {
    process.env.GMAIL_SMTP_USER = "dermamatch.test@gmail.com";
    process.env.GMAIL_SMTP_APP_PASSWORD = "sixteen-character-app-password";
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail });
    smtp.sendMail.mockResolvedValue({ messageId: "gmail-message-1" });

    const result = await sendConsultationApprovalEmail({
      recipientEmail: "ornek@example.com",
      recipientName: "Örnek Danışan",
      sessionId: 1,
      rawToken: "secure-test-token",
      expiresAt: new Date("2026-09-02T12:00:00.000Z"),
      appUrl: "https://dermamatch.example",
    });

    expect(smtp.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: { user: "dermamatch.test@gmail.com", pass: "sixteen-character-app-password" },
    });
    expect(smtp.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: "DermaMatch <dermamatch.test@gmail.com>",
      to: "ornek@example.com",
      replyTo: "dermamatch.test@gmail.com",
      subject: "DermaMatch görüşme alanınız hazır",
      text: expect.stringContaining("https://dermamatch.example/gorusme/secure-test-token"),
    }));
    expect(result).toEqual({ sent: true, deliveryId: "gmail-message-1" });
  });
});
