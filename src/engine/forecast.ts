// Daily forecast of the balance. Pure function: given a full account snapshot
// and a window of days, it returns the expected inflow/outflow/balance for each
// day. Numbers come only from the data, never from the AI. Money is integer FCFA.
//
// The projection uses the declared forward-looking entries: planned inflows
// (future cash sales, planned client repayments) and outflows (stock, rent,
// tuition, tontine). Recurring entries are expanded across the window.

import { today, addDays, eachDay } from "../lib/dates";
import type {
  AccountData,
  PlannedInflow,
  PlannedOutflow,
  Recurrence,
} from "../data/types";

export interface DayForecast {
  date: string; // "YYYY-MM-DD"
  inflow: number;
  outflow: number;
  balance: number;
}

// A date interval passed to canAfford / whatIf / suggest.
export interface Range {
  from: string; // "YYYY-MM-DD", inclusive
  to: string; // "YYYY-MM-DD", inclusive
}

// A run of consecutive days where the balance is negative.
export interface RedZone {
  from: string;
  to: string;
  worstBalance: number; // the lowest balance inside the zone (a negative number)
}

// Default window when none is given: today through the end of the month.
export function monthRange(): Range {
  const t = today();
  const [y, m] = t.split("-").map((n) => parseInt(n, 10));
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const to = `${t.slice(0, 6)}-${String(lastDay).padStart(2, "0")}`;
  return { from: t, to };
}

// How many times a recurring entry lands within [from, to], starting on its own
// date and stepping by the recurrence period.
function recurrenceHits(item: { date: string; recurring?: Recurrence }, range: Range): number {
  const first = item.date;
  if (first < range.from) return 0;
  // Walk forward by the step until we leave the window.
  let cursor = first;
  const step = item.recurring === "weekly" ? 7 : 30;
  let hits = 0;
  while (cursor <= range.to) {
    hits++;
    cursor = addDays(cursor, step);
  }
  return hits;
}

// Build a map from date -> total amount for a list of forward-looking entries.
function amountByDate(
  items: Array<{ amount: number; date: string; recurring?: Recurrence }>,
  range: Range,
): Map<string, number> {
  const byDay = new Map<string, number>();
  for (const item of items) {
    const hits = recurrenceHits(item, range);
    if (hits === 0) continue;
    let cursor = item.date;
    for (let i = 0; i < hits; i++) {
      byDay.set(cursor, (byDay.get(cursor) ?? 0) + item.amount);
      cursor = addDays(cursor, item.recurring === "weekly" ? 7 : 30);
    }
  }
  return byDay;
}

export function forecast(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  from: string,
  to: string,
): DayForecast[] {
  const range: Range = { from, to };
  const inflowByDay = amountByDate(inflows, range);
  const outflowByDay = amountByDate(outflows, range);

  const days: DayForecast[] = [];
  let balance = account.initialBalance;

  for (const date of eachDay(from, to)) {
    const inflow = inflowByDay.get(date) ?? 0;
    const outflow = outflowByDay.get(date) ?? 0;
    balance += inflow - outflow;
    days.push({ date, inflow, outflow, balance });
  }

  return days;
}

// Merge consecutive negative-balance days into zones.
export function redZones(days: DayForecast[]): RedZone[] {
  const zones: RedZone[] = [];
  let current: RedZone | null = null;

  for (const day of days) {
    if (day.balance < 0) {
      if (!current) {
        current = { from: day.date, to: day.date, worstBalance: day.balance };
      } else {
        current.to = day.date;
        current.worstBalance = Math.min(current.worstBalance, day.balance);
      }
    } else if (current) {
      zones.push(current);
      current = null;
    }
  }
  if (current) zones.push(current);
  return zones;
}
