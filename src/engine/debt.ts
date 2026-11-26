// What a client still owes. Pure: derived from the account rows. Money is
// integer FCFA. Exact formula of docs/ARCHITECTURE_DONNEES.md §3:
//
//   owed = Σ(sale.amountTotal − sale.amountPaid) − Σ repayment.amount
//
// over this client's rows only, ignoring cancelled rows (deletedAt set). The
// result is clamped at 0 so a client who has overpaid is reported as owed
// nothing, not a negative debt. A partial sale (amountPaid < amountTotal) leaves
// a positive remainder; a single sale row is enough to track it.

import type { Repayment, Sale } from "../data/types";

// A row that can be cancelled: cancelled rows (deletedAt set) never count.
function active<T extends { deletedAt?: string | null }>(row: T): boolean {
  return !row.deletedAt;
}

export function computeClientDebt(
  clientId: string,
  sales: Sale[],
  repayments: Repayment[],
): number {
  let owed = 0;

  for (const sale of sales) {
    if (!active(sale)) continue;
    if (sale.clientId !== clientId) continue;
    owed += sale.amountTotal - sale.amountPaid;
  }

  for (const rep of repayments) {
    if (!active(rep)) continue;
    if (rep.clientId !== clientId) continue;
    owed -= rep.amount;
  }

  return owed > 0 ? owed : 0;
}
