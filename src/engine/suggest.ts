// Suggestions to clear a red zone. Pure. Each candidate action (postpone an
// outflow, advance a planned inflow) is tested on its own by rerunning `forecast`;
// an action keeps it only when it removes the red zone. Numbers come only from
// the engine.

import { forecast, redZones, type Range } from "./forecast";
import type {
  AccountData,
  PlannedInflow,
  PlannedOutflow,
} from "../data/types";
import { addDays } from "../lib/dates";

export type SuggestionKind = "postponeOutflow" | "advanceInflow";

export interface Suggestion {
  kind: SuggestionKind;
  // id of the planned item moved.
  targetId: string;
  // Human sentence shown on the card.
  text: string;
  // Number of days the item is moved (negative = earlier, positive = later).
  shiftDays: number;
  // The new zone-free worst balance after the action, or null when none.
  resultingWorst: number | null;
}

// Does postponing the outflow by 7 days clear every red zone?
function postponingClears(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  outflow: PlannedOutflow,
  range: Range,
): boolean {
  const shifted = outflows.map((o) =>
    o.id === outflow.id ? { ...o, date: addDays(o.date, 7) } : o,
  );
  const days = forecast(account, inflows, shifted, range.from, range.to);
  return redZones(days).length === 0;
}

// Does advancing the inflow to the zone's start clear every red zone?
function advancingClears(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  inflow: PlannedInflow,
  zoneStart: string,
  range: Range,
): boolean {
  const shifted = inflows.map((i) =>
    i.id === inflow.id ? { ...i, date: zoneStart } : i,
  );
  const days = forecast(account, shifted, outflows, range.from, range.to);
  return redZones(days).length === 0;
}

// Worst balance across the window, or null when the balance never goes negative.
function worstOrNone(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  range: Range,
): number | null {
  const zones = redZones(forecast(account, inflows, outflows, range.from, range.to));
  if (zones.length === 0) return null;
  return Math.min(...zones.map((z) => z.worstBalance));
}

// Build the list of candidate suggestions that each clear a red zone on their own.
export function suggest(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  range: Range,
): Suggestion[] {
  const baseline = forecast(account, inflows, outflows, range.from, range.to);
  const zones = redZones(baseline);
  if (zones.length === 0) return [];

  const out: Suggestion[] = [];

  // 1. Postponing a recurring/declared outflow by a week.
  for (const zone of zones) {
    const candidate = outflows
      .filter((o) => o.date <= zone.to)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (candidate && postponingClears(account, inflows, outflows, candidate, range)) {
      out.push({
        kind: "postponeOutflow",
        targetId: candidate.id,
        text: `Reporter ${candidate.label ?? "ce besoin"} de 7 jours.`,
        shiftDays: 7,
        resultingWorst: worstOrNone(
          account,
          inflows,
          outflows.map((o) => (o.id === candidate.id ? { ...o, date: addDays(o.date, 7) } : o)),
          range,
        ),
      });
      break; // one postponing suggestion is enough.
    }
  }

  // 2. Advancing a planned inflow (a client repayment) to the zone start.
  for (const zone of zones) {
    const candidate = inflows
      .filter((i) => i.date > zone.from)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (candidate && advancingClears(account, inflows, outflows, candidate, zone.from, range)) {
      out.push({
        kind: "advanceInflow",
        targetId: candidate.id,
        text: `Décaler l'entrée ${candidate.label ?? "prévue"} au ${zone.from}.`,
        shiftDays: -(Math.max(1, daysBetween(zone.from, candidate.date))),
        resultingWorst: worstOrNone(
          account,
          inflows.map((i) => (i.id === candidate.id ? { ...i, date: zone.from } : i)),
          outflows,
          range,
        ),
      });
      break; // one advancing suggestion is enough.
    }
  }

  return out;
}

// Whole days between two "YYYY-MM-DD" strings, b minus a (always non-negative
// here by construction of the candidates).
function daysBetween(a: string, b: string): number {
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

function toUtc(iso: string): number {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return Date.UTC(y, m - 1, d);
}
