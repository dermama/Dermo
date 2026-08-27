import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createContext } from "../server/_core/context";
import { appRouter } from "../server/routers";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(createExpressMiddleware({ router: appRouter, createContext }));

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
