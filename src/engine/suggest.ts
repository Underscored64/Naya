// Pure "what should I do?" advisor. Given the current state it returns an ordered
// list of concrete actions to clear the first red zone:
//   - postpone "confort" needs first, then "important" (never "indispensable");
//   - remind clients whose debt is promised before the first red day.
// Each action is tested on its own by rerunning `forecast`; `resolvesShortfall`
// is true only when that single action removes the first red zone.

import type { AppState, Need } from "../data/types";
import { forecast, redZones, type Range } from "./forecast";

export type SuggestionKind = "postpone" | "remind";

export interface Suggestion {
  kind: SuggestionKind;
  targetId: string; // need id (postpone) or debt id (remind)
  label: string; // human French label, e.g. "Reporter le Pagne"
  resolvesShortfall: boolean;
}

const priorityRank: Record<string, number> = {
  confort: 0,
  important: 1,
  indispensable: 2,
};

// Whether postponing one need by 7 days clears the first red zone.
function postponingClears(state: AppState, need: Need, range: Range): boolean {
  const needs = state.needs.map((n) => (n.id === need.id ? { ...n, dueDate: postponeDueDate(need) } : n));
  const days = forecast(state.profile, needs, state.debts, range.from, range.to);
  return redZones(days).length === 0;
}

// New due date when "Reporter" is pressed: push the need back by one week.
// Shared by the UI and by `postponingClears` so the promise and the live effect
// always agree.
export function postponeDueDate(need: Need): string {
  return addDaysSafe(need.dueDate, 7);
}

// A tiny local add-days to avoid pulling the dates lib into this module's surface.
function addDaysSafe(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${dt.getUTCFullYear()}-${p(dt.getUTCMonth() + 1)}-${p(dt.getUTCDate())}`;
}

export function suggest(state: AppState, range: Range): Suggestion[] {
  const baseline = forecast(state.profile, state.needs, state.debts, range.from, range.to);
  const zones = redZones(baseline);
  if (zones.length === 0) return [];

  const firstRedDay = zones[0].from;

  // Postponable needs: "confort" before "important", never "indispensable".
  const postponable = state.needs
    .filter((n) => n.priority === "confort" || n.priority === "important")
    .sort((a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      a.dueDate.localeCompare(b.dueDate),
    );

  const out: Suggestion[] = postponable.map((n) => ({
    kind: "postpone",
    targetId: n.id,
    label: `Reporter le ${n.label.toLowerCase()}`,
    resolvesShortfall: postponingClears(state, n, range),
  }));

  // Reminders: clients whose unpaid debt is promised before the first red day,
  // soonest first. A reminder alone cannot clear the zone (the inflow is already
  // counted), so resolvesShortfall stays false.
  const reminders = state.debts
    .filter((d) => !d.paid && d.promisedDate < firstRedDay)
    .sort((a, b) => a.promisedDate.localeCompare(b.promisedDate))
    .map((d) => ({
      kind: "remind" as const,
      targetId: d.id,
      label: `Relancer ${d.client}`,
      resolvesShortfall: false,
    }));

  return [...out, ...reminders];
}
