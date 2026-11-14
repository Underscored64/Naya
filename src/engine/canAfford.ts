// Pure "can I afford this?" check. Adds a temporary need to the state, reruns
// the forecast, and reports whether a red zone appears. Never mutates the input.
// The money numbers all come from `forecast`/`redZones`, never from this file.

import type { Priority } from "../data/types";
import type { AppState } from "../data/types";
import { forecast, redZones, type Range } from "./forecast";

export interface AffordCheck {
  amount: number;
  date: string;
  priority: Priority;
}

export interface AffordResult {
  ok: boolean;
  // First day of the first red zone, when `ok` is false.
  firstShortfallDate?: string;
  // How much is missing on that day (positive FCFA), when `ok` is false.
  shortfall?: number;
}

export function canAfford(
  check: AffordCheck,
  state: AppState,
  range: Range,
): AffordResult {
  // A throwaway need carrying the same shape as a real one. Its id is unused by
  // the forecast, so a fixed placeholder is fine.
  const extra = {
    id: "__can-afford__",
    label: "Achat testé",
    amount: check.amount,
    dueDate: check.date,
    priority: check.priority,
  };

  const days = forecast(state.profile, [...state.needs, extra], state.debts, range.from, range.to);
  const zones = redZones(days);

  if (zones.length === 0) return { ok: true };

  const first = zones[0];
  return { ok: false, firstShortfallDate: first.from, shortfall: -first.worstBalance };
}
