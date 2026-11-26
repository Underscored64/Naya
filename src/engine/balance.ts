// Current balance from real rows. Pure: the exact formula of
// docs/ARCHITECTURE_DONNEES.md §3, in integer FCFA, ignoring cancelled rows
// (deletedAt set). The number is derived from the data, never from the AI.
//
//   balance = initialBalance
//           + Σ sale.amountPaid                  (only what was actually paid in)
//           + Σ repayment.amount
//           − Σ expense.amount
//
// A partial sale (amountPaid < amountTotal) simply contributes amountPaid to the
// cash — the remaining hole is the debt, tracked separately by computeClientDebt.

import type { Expense, Repayment, Sale } from "../data/types";

// A row that can be cancelled: cancelled rows (deletedAt set) never count.
function active<T extends { deletedAt?: string | null }>(row: T): boolean {
  return !row.deletedAt;
}

export function computeBalance(
  initialBalance: number,
  sales: Sale[],
  expenses: Expense[],
  repayments: Repayment[],
): number {
  let balance = initialBalance;

  for (const sale of sales) {
    if (!active(sale)) continue;
    balance += sale.amountPaid;
  }

  for (const rep of repayments) {
    if (!active(rep)) continue;
    balance += rep.amount;
  }

  for (const expense of expenses) {
    if (!active(expense)) continue;
    balance -= expense.amount;
  }

  return balance;
}
