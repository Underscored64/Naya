import { describe, it, expect } from "vitest";
import { whatIfNotPay } from "../../src/engine/whatIf";
import type { AppState } from "../../src/data/types";

const range = { from: "2026-01-01", to: "2026-01-07" };

describe("whatIfNotPay", () => {
  it("Esi not paying creates a red zone that was not there before", () => {
    const state: AppState = {
      profile: { openingBalance: 1000, avgDailySales: 0 },
      needs: [{ id: "loan", label: "Loyer", amount: 5000, dueDate: "2026-01-03", priority: "indispensable" }],
      debts: [{ id: "esi", client: "Esi", amount: 10000, promisedDate: "2026-01-03", paid: false }],
      sales: [],
    };

    const res = whatIfNotPay("esi", state, range);
    // With Esi paying, the day-3 inflow covers the outflow.
    expect(res.before).not.toHaveLength(0);
    expect(res.after).not.toHaveLength(0);
    expect(res.newRedZones.length).toBeGreaterThan(0);
    expect(res.newRedZones[0].from).toBe("2026-01-03");
  });

  it("never mutates the input", () => {
    const state: AppState = {
      profile: { openingBalance: 1000, avgDailySales: 0 },
      needs: [],
      debts: [{ id: "esi", client: "Esi", amount: 10000, promisedDate: "2026-01-03", paid: false }],
      sales: [],
    };
    const before = JSON.parse(JSON.stringify(state));
    whatIfNotPay("esi", state, range);
    expect(state.debts[0].paid).toBe(false);
    expect(state).toEqual(before);
  });
});
