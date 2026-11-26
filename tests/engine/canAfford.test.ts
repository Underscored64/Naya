import { describe, it, expect } from "vitest";
import { canAfford } from "../../src/engine/canAfford";
import type { AppState } from "../../src/data/types";

const range = { from: "2026-01-01", to: "2026-01-10" };

// A poor account: only a 1,000 opening, a 5,000 outflow on 01-03, nothing coming in.
const state: AppState = {
  initialBalance: 1000,
  clients: [],
  sales: [],
  expenses: [],
  repayments: [],
  outflows: [{ id: "loan", amount: 5000, date: "2026-01-03", label: "Loyer" }],
  inflows: [],
};

describe("canAfford", () => {
  it("afforded when the account is rich", () => {
    const rich: AppState = { ...state, initialBalance: 50000, outflows: [] };
    const res = canAfford(rich, rich.inflows, rich.outflows, 1000, "2026-01-02", range);
    expect(res.ok).toBe(true);
  });

  it("not afforded when it would create a red zone", () => {
    const res = canAfford(state, state.inflows, state.outflows, 5000, "2026-01-03", range);
    expect(res.ok).toBe(false);
    expect(res.firstRedDay).toBeTruthy();
  });

  it("does not mutate the passed state", () => {
    const outflows = state.outflows;
    canAfford(state, state.inflows, state.outflows, 5000, "2026-01-03", range);
    expect(outflows).toHaveLength(1);
  });
});
