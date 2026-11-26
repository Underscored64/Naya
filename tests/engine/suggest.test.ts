import { describe, it, expect } from "vitest";
import { suggest } from "../../src/engine/suggest";
import type { AppState } from "../../src/data/types";

describe("suggest", () => {
  it("proposes postponing an outflow to clear a red zone", () => {
    const state: AppState = {
      initialBalance: 1000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      // A 5,000 outflow on 01-03 dips the balance to -4,000 within the window.
      outflows: [{ id: "loan", amount: 5000, date: "2026-01-03", label: "Loyer" }],
      inflows: [],
    };
    const range = { from: "2026-01-01", to: "2026-01-04" };
    const out = suggest(state, state.inflows, state.outflows, range);
    expect(out.length).toBeGreaterThan(0);
    // The candidate is the loan, postponed by 7 days (which leaves the window).
    expect(out.some((s) => s.kind === "postponeOutflow" && s.targetId === "loan")).toBe(true);
  });

  it("proposes nothing when there is no red zone", () => {
    const state: AppState = {
      initialBalance: 50000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      outflows: [],
      inflows: [],
    };
    const out = suggest(state, state.inflows, state.outflows, { from: "2026-01-01", to: "2026-01-10" });
    expect(out).toHaveLength(0);
  });

  it("proposes advancing a planned repayment to clear a red zone", () => {
    const state: AppState = {
      initialBalance: 1000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      // A 5,000 outflow on 01-03 leaves the balance at -4,000 until a 10,000
      // repayment is planned on 01-05 — pulling it to 01-03 clears the zone.
      outflows: [{ id: "loan", amount: 5000, date: "2026-01-03", label: "Loyer" }],
      inflows: [{ id: "esi", amount: 10000, date: "2026-01-05", label: "Esi" }],
    };
    const range = { from: "2026-01-01", to: "2026-01-10" };
    const out = suggest(state, state.inflows, state.outflows, range);
    expect(out.some((s) => s.kind === "advanceInflow" && s.targetId === "esi")).toBe(true);
  });
});
