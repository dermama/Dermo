import { beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_SESSION_DURATION_MS, CONSULTATION_DURATION_MS, createAdminSessionToken, createConsultationToken,
  dateSevenDaysFrom, hashOpaqueToken, passwordsMatch, sessionIsAccessible, verifyAdminSessionToken,
} from "./consultationSecurity";

describe("consultation security", () => {
  beforeEach(() => { process.env.JWT_SECRET = "test-only-signing-secret"; });

  it("creates an opaque token and retains only its non-reversible hash", () => {
    const token = createConsultationToken();
    expect(token.length).toBeGreaterThan(40);
    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toHaveLength(64);
  });

  it("sets the consultation expiry to exactly seven 24-hour periods", () => {
    const start = new Date("2026-08-26T12:00:00.000Z");
    expect(dateSevenDaysFrom(start).getTime() - start.getTime()).toBe(CONSULTATION_DURATION_MS);
  });

  it("denies revoked, expired and incorrect-token sessions", () => {
    const token = "valid-client-token";
    const active = { tokenHash: hashOpaqueToken(token), expiresAt: new Date("2026-09-02T12:00:00.000Z"), revokedAt: null };
    expect(sessionIsAccessible(active, token, new Date("2026-08-30T12:00:00.000Z"))).toBe(true);
    expect(sessionIsAccessible(active, "another-token", new Date("2026-08-30T12:00:00.000Z"))).toBe(false);
    expect(sessionIsAccessible({ ...active, revokedAt: new Date("2026-08-29T10:00:00.000Z") }, token, new Date("2026-08-30T12:00:00.000Z"))).toBe(false);
    expect(sessionIsAccessible(active, token, new Date("2026-09-02T12:00:00.000Z"))).toBe(false);
  });

  it("uses a constant-time password comparison result", () => {
    expect(passwordsMatch("correct-password", "correct-password")).toBe(true);
    expect(passwordsMatch("incorrect-password", "correct-password")).toBe(false);
  });

  it("issues a short-lived signed admin session", async () => {
    const token = await createAdminSessionToken();
    expect(await verifyAdminSessionToken(token)).toBe(true);
    expect(ADMIN_SESSION_DURATION_MS).toBe(12 * 60 * 60 * 1000);
  });
});
