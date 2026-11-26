// "What if this client does not pay?" Pure: it removes one planned inflow from
// the forecast, reruns the forecast, and reports the difference in red zones.
// Never mutates the input.

import { forecast, redZones, type DayForecast, type RedZone, type Range } from "./forecast";
import type { AccountData, PlannedInflow, PlannedOutflow } from "../data/types";

export interface WhatIfResult {
  // Did a red zone newly appear because of the missed payment?
  newRedZone: boolean;
  // Red zones in the "no payment" scenario.
  zones: RedZone[];
  // The daily forecast after removing the inflow.
  days: DayForecast[];
}

export function whatIfNotPay(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  range: Range,
  inflowId: string,
): WhatIfResult {
  const before = forecast(account, inflows, outflows, range.from, range.to);
  const without = inflows.filter((i) => i.id !== inflowId);
  const after = forecast(account, without, outflows, range.from, range.to);

  const beforeZones = redZones(before);
  const afterZones = redZones(after);

  return {
    newRedZone: afterZones.length > beforeZones.length,
    zones: afterZones,
    days: after,
  };
}
