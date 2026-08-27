import type { VercelRequest, VercelResponse } from "@vercel/node";

const packages = [
  "@trpc/server",
  "@trpc/server/adapters/express",
  "zod",
  "cookie",
  "jose",
  "@neondatabase/serverless",
  "drizzle-orm/neon-http",
  "resend",
] as const;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const results: Record<string, "ok" | "failed"> = {};
  for (const packageName of packages) {
    try {
      await import(packageName);
      results[packageName] = "ok";
    } catch (error) {
      console.error("[DermaMatch API] Dependency import failed", packageName, error);
      results[packageName] = "failed";
    }
  }
  res.status(200).json({ results });
}
