import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createContext } from "../server/_core/context";
import { appRouter } from "../server/routers";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
app.use((error: unknown, _req: VercelRequest, res: VercelResponse, _next: () => void) => {
  console.error("[DermaMatch API] Unhandled tRPC function error", error);
  if (!res.headersSent) res.status(500).json({ error: "Görüşme hizmeti şu anda kullanılamıyor." });
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
