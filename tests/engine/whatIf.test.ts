import { describe, it, expect } from "vitest";
import { whatIfNotPay } from "../../src/engine/whatIf";
import type { AppState } from "../../src/data/types";

const range = { from: "2026-01-01", to: "2026-01-10" };

describe("whatIfNotPay", () => {
  it("flags a new red zone when a client does not pay", () => {
    const state: AppState = {
      initialBalance: 1000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      outflows: [{ id: "loan", amount: 5000, date: "2026-01-03", label: "Loyer" }],
      inflows: [{ id: "esi", amount: 10000, date: "2026-01-03", label: "Esi" }],
    };
    const res = whatIfNotPay(state, state.inflows, state.outflows, range, "esi");
    expect(res.newRedZone).toBe(true);
    expect(res.zones.length).toBeGreaterThan(0);
  });

  it("does not change the inflow list (no mutation)", () => {
    const state: AppState = {
      initialBalance: 1000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      outflows: [{ id: "loan", amount: 5000, date: "2026-01-03", label: "Loyer" }],
      inflows: [{ id: "esi", amount: 10000, date: "2026-01-03", label: "Esi" }],
    };
    whatIfNotPay(state, state.inflows, state.outflows, range, "esi");
    expect(state.inflows).toHaveLength(1);
  });
});
