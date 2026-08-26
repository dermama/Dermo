import { describe, expect, it } from "vitest";
import { consultationPlans, faqs, formulaModes, servicePillars } from "../shared/siteContent";

describe("DermaMatch site content", () => {
  it("keeps the consultation journey complete and scannable", () => {
    expect(servicePillars).toHaveLength(3);
    expect(servicePillars.map((pillar) => pillar.number)).toEqual(["01", "02", "03"]);
    expect(consultationPlans).toHaveLength(3);
    expect(consultationPlans.every((plan) => plan.includes.length === 3)).toBe(true);
  });

  it("includes a clear medical-scope disclaimer in the questions", () => {
    expect(faqs.some((item) => item.answer.includes("tanı, tedavi veya reçete yerine geçmez"))).toBe(true);
  });

  it("keeps Formula Explorer as a complete three-step discovery sequence", () => {
    expect(formulaModes.map((mode) => mode.number)).toEqual(["01", "02", "03"]);
    expect(formulaModes.map((mode) => mode.name)).toEqual(["Dengele", "Seç", "Koru"]);
    expect(formulaModes.every((mode) => mode.title && mode.description && mode.note)).toBe(true);
  });
});
