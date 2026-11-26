// AI fallback — runs when there is no LLM key. It produces the same outputs the
// AI would: a list of 1–3 "home" notifications and an "explanation" string. The
// money numbers all come from the engine (pure, testable), so the app works
// fully without the AI. See docs/ARCHITECTURE_DONNEES.md §4.
import { forecast, redZones } from "../engine/forecast";
import { computeClientDebt } from "../engine/debt";
import { formatF, formatShortDate } from "../lib/format";
import type { AppState } from "../data/types";

export type NotificationTone = "warn" | "info" | "good";

export interface HomeNotification {
  id: string;
  tone: NotificationTone;
  text: string; // one or two short sentences, in French, no jargon
}

// "You can make it" — no red zone in the window.
function explainNoZone(): string {
  return "Bonne nouvelle : votre solde reste positif tout le mois. Vous pouvez tenir.";
}

// "You'll be short" — at least one red zone, with the day it starts.
function explainRedZone(redDays: string): string {
  return `Attention : le ${formatShortDate(redDays)}, votre solde pourrait passer en rouge. Réglez un besoin plus tôt ou rappelez un client avant cette date.`;
}

// Upcoming debts: the largest amount the user still owes, if any.
function largestDebt(state: AppState): number {
  let max = 0;
  for (const client of state.clients) {
    const owed = computeClientDebt(client.id, state.sales, state.repayments);
    if (owed > max) max = owed;
  }
  return max;
}

// 1 to 3 warm, concrete notifications about the next few days, derived from the
// real account. No chart, no jargon — the user reads her situation first.
export function homeNotifications(state: AppState, todayStr: string, end: string): HomeNotification[] {
  const out: HomeNotification[] = [];

  const zones = redZones(forecast(state, state.inflows, state.outflows, todayStr, end));
  if (zones.length === 0) {
    out.push({ id: "ok", tone: "good", text: explainNoZone() });
  } else {
    const first = zones[0];
    out.push({ id: "short", tone: "warn", text: explainRedZone(first.from) });
  }

  // Largest outstanding debt, if any client still owes.
  const debt = largestDebt(state);
  if (debt > 0) {
    out.push({ id: "debt", tone: "info", text: `Un client vous doit ${formatF(debt)}. Envoyez un rappel avant la fin du mois.` });
  }

  return out.slice(0, 3);
}
