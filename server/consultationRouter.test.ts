import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: null,
  req: { headers: {}, protocol: "https" } as TrpcContext["req"],
  res: { cookie: () => undefined, clearCookie: () => undefined } as TrpcContext["res"],
};

describe("consultation procedures", () => {
  it("requires both client-side consent acknowledgements at the API boundary", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.consultation.submit({
      fullName: "Örnek Danışan",
      email: "ornek@example.com",
      consultationType: "Rutin başlangıcı",
      inquirySummary: "Genel bakım yaklaşımımı değerlendirmek istiyorum.",
      careScopeAccepted: false,
      privacyAccepted: true,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects management data requests without a valid password session", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.consultation.admin.list({ status: "all" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
