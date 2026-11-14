// Pure "what if this client does not pay?" simulation. Drops one debt's inflow,
// reruns the forecast, and reports the difference in red zones. Never mutates.

import type { AppState } from "../data/types";
import { forecast, redZones, type DayForecast, type RedZone, type Range } from "./forecast";

export interface WhatIfResult {
  before: DayForecast[];
  after: DayForecast[];
  // New red zones that appear once the client's payment is removed.
  newRedZones: RedZone[];
}

export function whatIfNotPay(
  debtId: string,
  state: AppState,
  range: Range,
): WhatIfResult {
  const { profile, needs, debts } = state;

  const before = forecast(profile, needs, debts, range.from, range.to);
  // Remove the selected client's promised inflow by treating the debt as paid.
  const without = debts.map((d) => (d.id === debtId ? { ...d, paid: true } : d));
  const after = forecast(profile, needs, without, range.from, range.to);

  // Red zones that did not exist before the client stopped paying.
  const beforeZones = redZones(before);
  const afterZones = redZones(after);
  const newRedZones = afterZones.filter(
    (z) => !beforeZones.some((b) => z.from >= b.from && z.to <= b.to),
  );

  return { before, after, newRedZones };
}
