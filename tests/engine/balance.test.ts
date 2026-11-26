import { describe, it, expect } from "vitest";
import { computeBalance } from "../../src/engine/balance";
import type { Expense, Repayment, Sale } from "../../src/data/types";

function sale(over: Partial<Sale> = {}): Sale {
  return {
    id: "s",
    clientId: "awa",
    amountTotal: 5000,
    amountPaid: 5000,
    paymentMethod: "especes",
    source: "manuel",
    ...over,
  };
}

function expense(over: Partial<Expense> = {}): Expense {
  return {
    id: "e",
    amount: 1000,
    category: "transport",
    paymentMethod: "especes",
    source: "manuel",
    ...over,
  };
}

function repayment(over: Partial<Repayment> = {}): Repayment {
  return { id: "r", clientId: "awa", amount: 1000, ...over };
}

describe("computeBalance (§3: initial + Σ paid + Σ repayments − Σ expenses)", () => {
  it("returns the initial balance when there are no rows", () => {
    expect(computeBalance(5000, [], [], [])).toBe(5000);
  });

  it("adds only amountPaid for a sale (a partial sale contributes what was paid)", () => {
    const data = [sale({ amountTotal: 50000, amountPaid: 30000 })];
    expect(computeBalance(10000, data, [], [])).toBe(10000 + 30000);
  });

  it("adds repayments and subtracts expenses", () => {
    expect(
      computeBalance(
        0,
        [sale({ amountTotal: 5000, amountPaid: 5000 })],
        [expense({ amount: 3000 })],
        [repayment({ amount: 1000 })],
      ),
    ).toBe(5000 + 1000 - 3000); // 3,000
  });

  it("ignores cancelled rows (deletedAt set)", () => {
    expect(
      computeBalance(
        0,
        [
          sale({ id: "s1", amountTotal: 5000, amountPaid: 5000 }),
          sale({ id: "s2", amountPaid: 9000, deletedAt: "2026-12-10" }),
        ],
        [
          expense({ id: "e1", amount: 1000 }),
          expense({ id: "e2", amount: 9999, deletedAt: "2026-12-10" }),
        ],
        [repayment({ id: "r1", amount: 2000 }), repayment({ id: "r2", amount: 7777, deletedAt: "2026-12-10" })],
      ),
    ).toBe(5000 + 2000 - 1000); // 6,000
  });

  it("matches the §3 worked example", () => {
    // initial 70,000 + paid (30,000) + repayments (10,000) − expenses (3,000)
    expect(
      computeBalance(
        70000,
        [sale({ amountTotal: 50000, amountPaid: 30000 })],
        [expense({ amount: 3000 })],
        [repayment({ amount: 10000 })],
      ),
    ).toBe(107000);
  });
});
