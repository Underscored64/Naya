import { describe, it, expect } from "vitest";
import { canAfford } from "../../src/engine/canAfford";
import type { AppState } from "../../src/data/types";

const state: AppState = {
  profile: { openingBalance: 1000, avgDailySales: 0 },
  needs: [{ id: "loan", label: "Loyer", amount: 5000, dueDate: "2026-01-03", priority: "indispensable" }],
  debts: [],
  sales: [],
};

const range = { from: "2026-01-01", to: "2026-01-07" };

describe("canAfford", () => {
  it("affordable purchase leaves no red zone", () => {
    const rich: AppState = { ...state, profile: { openingBalance: 50000, avgDailySales: 5000 } };
    const res = canAfford({ amount: 1000, date: "2026-01-02", priority: "confort" }, rich, range);
    expect(res.ok).toBe(true);
    expect(res.firstShortfallDate).toBeUndefined();
  });

  it("a purchase that creates a shortfall points at a known date", () => {
    const res = canAfford({ amount: 5000, date: "2026-01-03", priority: "confort" }, state, range);
    expect(res.ok).toBe(false);
    // baseline already turns red on 01-03; the test need just deepens it.
    expect(res.firstShortfallDate).toBe("2026-01-03");
    expect(res.shortfall).toBeGreaterThan(0);
  });

  it("never mutates the input", () => {
    const before = JSON.parse(JSON.stringify(state));
    canAfford({ amount: 5000, date: "2026-01-03", priority: "confort" }, state, range);
    expect(state).toEqual(before);
  });
});
