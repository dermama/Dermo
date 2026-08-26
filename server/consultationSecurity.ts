import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE = "dermamatch_admin_session";
export const ADMIN_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
export const CONSULTATION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required for secure session handling");
  return new TextEncoder().encode(secret);
}

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createConsultationToken() {
  return randomBytes(32).toString("base64url");
}

export function dateSevenDaysFrom(now: Date) {
  return new Date(now.getTime() + CONSULTATION_DURATION_MS);
}

export function passwordsMatch(candidate: string, expected: string) {
  const candidateHash = Buffer.from(hashOpaqueToken(candidate));
  const expectedHash = Buffer.from(hashOpaqueToken(expected));
  return timingSafeEqual(candidateHash, expectedHash);
}

export function sessionIsAccessible(
  session: { tokenHash: string; expiresAt: Date; revokedAt: Date | null },
  rawToken: string,
  now = new Date(),
) {
  return session.tokenHash === hashOpaqueToken(rawToken) && session.revokedAt === null && session.expiresAt.getTime() > now.getTime();
}

export async function createAdminSessionToken() {
  const now = Date.now();
  return new SignJWT({ scope: "dermamatch:admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(now / 1000))
    .setExpirationTime(Math.floor((now + ADMIN_SESSION_DURATION_MS) / 1000))
    .sign(secretKey());
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.scope === "dermamatch:admin";
  } catch {
    return false;
  }
}
