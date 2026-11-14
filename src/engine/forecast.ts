// Forecast engine — pure, no React/DOM/AI imports.
// Given a profile, needs and debts, project a daily balance over a range.
// Money is integer FCFA; dates are "YYYY-MM-DD" strings.

import { addDays, daysBetween, eachDay } from "../lib/dates";
import type { Debt, Need, Profile } from "../data/types";

export interface DayForecast {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

export interface RedZone {
  from: string;
  to: string;
  worstBalance: number;
}

// Add one calendar month to an ISO date string.
function addMonth(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const daysInNewMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(Math.min(d, daysInNewMonth)).padStart(2, "0")}`;
}

// All occurrences of a need within [from, to], expanding weekly/monthly recurrence.
function occurrencesOf(need: Need, from: string, to: string): string[] {
  if (!need.recurring) {
    return need.dueDate >= from && need.dueDate <= to ? [need.dueDate] : [];
  }
  const out: string[] = [];
  let cur = need.dueDate;
  // Walk backward so the first occurrence is the first day it falls on or after `from`.
  while (daysBetween(cur, from) > 0) {
    cur = need.recurring === "weekly" ? addDays(cur, -7) : addMonth(cur);
  }
  // Skip occurrences strictly before `from`, then walk forward through `to`.
  while (cur < from) {
    cur = need.recurring === "weekly" ? addDays(cur, 7) : addMonth(cur);
  }
  while (cur <= to) {
    out.push(cur);
    cur = need.recurring === "weekly" ? addDays(cur, 7) : addMonth(cur);
  }
  return out;
}

// Project a daily balance from `from` to `to` (inclusive).
export function forecast(
  profile: Profile,
  needs: Need[],
  debts: Debt[],
  from: string,
  to: string,
): DayForecast[] {
  // Pre-compute outflow per day.
  const outflowByDay = new Map<string, number>();
  for (const need of needs) {
    for (const day of occurrencesOf(need, from, to)) {
      outflowByDay.set(day, (outflowByDay.get(day) ?? 0) + need.amount);
    }
  }

  // Pre-compute inflow from unpaid debts per promised day.
  const inflowDebtByDay = new Map<string, number>();
  for (const debt of debts) {
    if (debt.paid) continue;
    if (debt.promisedDate < from || debt.promisedDate > to) continue;
    inflowDebtByDay.set(debt.promisedDate, (inflowDebtByDay.get(debt.promisedDate) ?? 0) + debt.amount);
  }

  const days = eachDay(from, to);
  const result: DayForecast[] = [];
  let balance = profile.openingBalance;

  for (const date of days) {
    const inflow = profile.avgDailySales + (inflowDebtByDay.get(date) ?? 0);
    const outflow = outflowByDay.get(date) ?? 0;
    balance = balance + inflow - outflow;
    result.push({ date, inflow, outflow, balance });
  }

  return result;
}

// Merge consecutive days with a negative balance into red zones, each carrying
// its lowest balance.
export function redZones(days: DayForecast[]): RedZone[] {
  const zones: RedZone[] = [];
  let start: DayForecast | null = null;
  let lastNeg: DayForecast | null = null;
  let worst = 0;

  for (const day of days) {
    if (day.balance < 0) {
      if (!start) {
        start = day;
        worst = day.balance;
      } else {
        worst = Math.min(worst, day.balance);
      }
      lastNeg = day;
    } else if (start) {
      zones.push({ from: start.date, to: lastNeg!.date, worstBalance: worst });
      start = null;
      lastNeg = null;
      worst = 0;
    }
  }
  if (start && lastNeg) {
    zones.push({ from: start.date, to: lastNeg.date, worstBalance: worst });
  }
  return zones;
}
