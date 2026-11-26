// Can the user afford a spending of a given amount on a given day? Pure: it
// appends the spending as a planned outflow, reruns the forecast, and reports
// whether a red zone appears. The money numbers all come from `forecast`/
// `redZones`, never from this file.

import { forecast, redZones, type Range } from "./forecast";
import type { AccountData, PlannedInflow, PlannedOutflow } from "../data/types";

export interface AffordResult {
  ok: boolean;
  // The worst (lowest) balance across the window, or null when it never dips.
  worstBalance: number | null;
  // The first day the balance goes negative, if any.
  firstRedDay: string | null;
}

export function canAfford(
  account: AccountData,
  inflows: PlannedInflow[],
  outflows: PlannedOutflow[],
  amount: number,
  date: string,
  range: Range,
): AffordResult {
  const extra: PlannedOutflow = {
    id: "what-if",
    amount,
    date,
  };

  const days = forecast(account, inflows, [...outflows, extra], range.from, range.to);
  const zones = redZones(days);

  if (zones.length === 0) {
    return { ok: true, worstBalance: null, firstRedDay: null };
  }

  const first = zones[0];
  return { ok: false, worstBalance: first.worstBalance, firstRedDay: first.from };
}
