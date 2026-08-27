import express, { type NextFunction, type Request, type Response } from "express";
import { createExpressMiddleware, type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { router } from "../_core/trpc";
import { consultationRouter } from "../consultationRouter";
import type { TrpcContext } from "../_core/context";

const vercelRouter = router({ consultation: consultationRouter });
const createConsultationContext = ({ req, res }: CreateExpressContextOptions): TrpcContext => ({ req, res, user: null });

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api/trpc", createExpressMiddleware({ router: vercelRouter, createContext: createConsultationContext }));
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[DermaMatch API] Unhandled tRPC function error", error);
  if (!res.headersSent) res.status(500).json({ error: "Görüşme hizmeti şu anda kullanılamıyor." });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
