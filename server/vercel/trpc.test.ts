import type { Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { app } from "./trpc";

let server: Server | undefined;

afterEach(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => server?.close(error => error ? reject(error) : resolve()));
  server = undefined;
});

describe("Vercel consultation tRPC handler", () => {
  it("returns a JSON admin-session status response through Express", async () => {
    server = await new Promise<Server>(resolve => {
      const listeningServer = app.listen(0, "127.0.0.1", () => resolve(listeningServer));
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not expose a TCP address.");

    const response = await fetch(`http://127.0.0.1:${address.port}/api/trpc/consultation.admin.status?batch=1&input=%7B%7D`);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([{ result: { data: { json: { authenticated: false } } } }]);
  });
});
