import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appRouter } from "../server/routers";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, procedures: Object.keys(appRouter._def.procedures).length });
}
