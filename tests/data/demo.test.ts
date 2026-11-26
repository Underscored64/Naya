import { describe, it, expect } from "vitest";
import { makeDemo } from "../../src/data/demo";
import { computeBalance } from "../../src/engine/balance";
import { computeClientDebt } from "../../src/engine/debt";
import type { AppState } from "../../src/data/types";

// The demo is the "you can make it" story: a brief red zone on 12-10/12-11 that
// Esi's repayment on 12-12 clears.
describe("makeDemo", () => {
  it("returns a fully populated account", () => {
    const state = makeDemo();
    expect(state.initialBalance).toBe(70000);
    expect(state.clients.map((c) => c.name).sort()).toEqual(["Awa", "Esi"]);
    expect(state.sales.length).toBeGreaterThan(0);
    expect(state.inflows.length).toBeGreaterThan(0);
    expect(state.outflows.length).toBeGreaterThan(0);
  });

  it("keeps every amount an integer and every date a valid ISO string", () => {
    const state = makeDemo();
    for (const s of state.sales) {
      expect(Number.isInteger(s.amountTotal)).toBe(true);
      expect(Number.isInteger(s.amountPaid)).toBe(true);
      expect(s.amountPaid).toBeLessThanOrEqual(s.amountTotal);
    }
    for (const e of state.expenses) {
      expect(Number.isInteger(e.amount)).toBe(true);
    }
    for (const r of state.repayments) {
      expect(Number.isInteger(r.amount)).toBe(true);
    }
    for (const f of [...state.inflows, ...state.outflows]) {
      expect(f.date).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
    }
  });

  it("computes the per-client debt", () => {
    const state = makeDemo();
    const awa = state.clients.find((c) => c.name === "Awa")!;
    const esi = state.clients.find((c) => c.name === "Esi")!;
    expect(computeClientDebt(awa.id, state.sales, state.repayments)).toBe(10000); // 50,000 − 30,000 paid − 10,000 repaid
    expect(computeClientDebt(esi.id, state.sales, state.repayments)).toBe(40000); // 40,000 on credit, nothing repaid
  });

  it("computes a single current balance across all rows (§3)", () => {
    const state: AppState = makeDemo();
    // §3: initial 70,000 + paid (30,000) + repayments (10,000) − expenses (3,000)
    expect(
      computeBalance(
        state.initialBalance,
        state.sales,
        state.expenses,
        state.repayments,
      ),
    ).toBe(107000);
  });
});
