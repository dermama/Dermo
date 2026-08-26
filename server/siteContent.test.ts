import { describe, expect, it } from "vitest";
import { consultationPlans, faqs, servicePillars } from "../shared/siteContent";

describe("NÛR site content", () => {
  it("keeps the consultation journey complete and scannable", () => {
    expect(servicePillars).toHaveLength(3);
    expect(servicePillars.map((pillar) => pillar.number)).toEqual(["01", "02", "03"]);
    expect(consultationPlans).toHaveLength(3);
    expect(consultationPlans.every((plan) => plan.includes.length === 3)).toBe(true);
  });

  it("includes a clear medical-scope disclaimer in the questions", () => {
    expect(faqs.some((item) => item.answer.includes("tanı, tedavi veya reçete yerine geçmez"))).toBe(true);
  });
});
