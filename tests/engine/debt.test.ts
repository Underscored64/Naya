import { describe, it, expect } from "vitest";
import { computeClientDebt } from "../../src/engine/debt";
import type { Repayment, Sale } from "../../src/data/types";

function sale(over: Partial<Sale> = {}): Sale {
  return {
    id: "s",
    clientId: "awa",
    amountTotal: 5000,
    amountPaid: 0,
    paymentMethod: "especes",
    source: "manuel",
    ...over,
  };
}

function rep(over: Partial<Repayment> = {}): Repayment {
  return { id: "r", clientId: "awa", amount: 1000, ...over };
}

describe("computeClientDebt (§3: Σ(total − paid) − Σ repayments, clamped at 0)", () => {
  it("returns 0 when the client owes nothing", () => {
    expect(computeClientDebt("awa", [], [])).toBe(0);
  });

  it("computes the remainder of a partial sale", () => {
    const sales = [sale({ id: "s1", amountTotal: 50000, amountPaid: 30000 })];
    expect(computeClientDebt("awa", sales, [])).toBe(20000);
  });

  it("subtracts repayments from what is owed", () => {
    const sales = [sale({ id: "s1", amountTotal: 50000, amountPaid: 0 })];
    const reps = [rep({ amount: 35000 })];
    expect(computeClientDebt("awa", sales, reps)).toBe(15000);
  });

  it("clamps an overpaid client to 0", () => {
    const sales = [sale({ id: "s1", amountTotal: 1000, amountPaid: 0 })];
    const reps = [rep({ amount: 5000 })];
    expect(computeClientDebt("awa", sales, reps)).toBe(0);
  });

  it("does not count another client's rows", () => {
    const sales = [sale({ id: "s1", clientId: "awa", amountTotal: 5000, amountPaid: 0 })];
    expect(computeClientDebt("esi", sales, [])).toBe(0);
    expect(computeClientDebt("awa", sales, [])).toBe(5000);
  });

  it("ignores cancelled rows", () => {
    const sales = [
      sale({ id: "s1", amountTotal: 5000, amountPaid: 0 }),
      sale({ id: "s2", amountTotal: 9000, amountPaid: 0, deletedAt: "2026-12-10" }),
    ];
    expect(computeClientDebt("awa", sales, [])).toBe(5000);
  });
});
