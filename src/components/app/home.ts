// Home derivations from the real account rows. Pure, no React/Supabase/AI:
// every number here comes from the engine, never from the AI (docs/DESIGN.md
// §6 "notifications first", §7). The home is built from this, structure only.
import { computeBalance } from "../../engine/balance";
import { computeClientDebt } from "../../engine/debt";
import { eachDay } from "../../lib/dates";
import { formatF } from "../../lib/format";
import type { Client, Expense, Repayment, Sale } from "../../data/types";
import type { HomeNotification } from "../../ai/fallback";

// The rows the home reads. Each list is already non-cancelled (the query layer
// filters deleted_at); the engine filters again as a safety net.
export interface HomeRows {
  sales: Sale[];
  expenses: Expense[];
  repayments: Repayment[];
  clients: Client[];
}

// True when a brand-new account has nothing yet — the home shows a warm invite.
export function isEmpty(rows: HomeRows): boolean {
  return (
    rows.sales.length === 0 &&
    rows.expenses.length === 0 &&
    rows.repayments.length === 0 &&
    rows.clients.length === 0
  );
}

// Current cash on hand from real rows. The opening balance is 0: money is what
// actually came in (sales paid + repayments) minus what went out (expenses).
export function currentBalance(rows: HomeRows): number {
  return computeBalance(0, rows.sales, rows.expenses, rows.repayments);
}

// Per-client outstanding debt, owed > 0, largest first.
export function outstandingDebts(rows: HomeRows): { client: Client; owed: number }[] {
  return rows.clients
    .map((client) => ({
      client,
      owed: computeClientDebt(client.id, rows.sales, rows.repayments),
    }))
    .filter((d) => d.owed > 0)
    .sort((a, b) => b.owed - a.owed);
}

// 1 to 3 concrete notifications, generated from the real data. Order: a red flag
// (a negative balance) first, then the biggest debt, then a reassuring "all good"
// when there is nothing to worry about. Warm, French, no jargon.
export function homeNotifications(rows: HomeRows): HomeNotification[] {
  const out: HomeNotification[] = [];
  const balance = currentBalance(rows);
  const debts = outstandingDebts(rows);

  if (balance < 0) {
    out.push({
      id: "low",
      tone: "warn",
      text: `Attention, votre solde du mois passe en rouge (${formatF(
        balance,
      )}). Reportez un besoin ou rappelez un client.`,
    });
  }

  if (debts.length > 0) {
    const top = debts[0];
    out.push({
      id: "debt",
      tone: "info",
      text: `${top.client.name} vous doit ${formatF(top.owed)}. Envoyez un rappel avant la fin du mois.`,
    });
  }

  if (out.length === 0) {
    out.push({
      id: "ok",
      tone: "good",
      text: "Bonne nouvelle : votre solde du mois reste positif. Vous pouvez tenir.",
    });
  }

  return out.slice(0, 3);
}

// Daily running balance from the 1st of the current month to today, built from
// real rows — feeds the month summary's mini-curve. A brand-new account yields
// a flat [0] so the curve renders a single calm line, never a scary empty one.
export function balanceSeries(rows: HomeRows, today: string): number[] {
  const [y, m] = today.split("-").map((n) => parseInt(n, 10));
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const days = eachDay(start, today);
  if (days.length === 0) return [0];

  // Net movement landing on each calendar day (inflows positive, outflows
  // negative). Repayments carry no day, so they enter the total on day one.
  const byDay = new Map<string, number>();
  const add = (iso: string | undefined | null, delta: number) => {
    if (!iso) return;
    const day = iso.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + delta);
  };

  for (const s of rows.sales) add(s.createdAt, s.amountPaid);
  for (const e of rows.expenses) add(e.createdAt, -e.amount);
  // Repayments carry no day, so they enter the running total on the 1st.
  const repaid = rows.repayments.reduce((sum, r) => sum + r.amount, 0);
  if (repaid > 0) byDay.set(start, (byDay.get(start) ?? 0) + repaid);

  const series: number[] = [];
  let balance = 0;
  for (const day of days) {
    balance += byDay.get(day) ?? 0;
    series.push(balance);
  }
  return series;
}
