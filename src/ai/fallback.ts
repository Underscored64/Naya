// Standard (non-AI) messages for Naya. The app must work with the LLM off, so
// every screen has a deterministic French message it can show on its own.
// Numbers always come from the engine or from the user's input — these
// templates only pick the wording, never invent an amount.

import { forecast, redZones } from "../engine/forecast";
import type { AppState, Need } from "../data/types";
import { formatDate, formatF } from "../lib/format";
import { daysBetween } from "../lib/dates";

// "Il vous manquera 45 000 F le lundi 5 mars."
export function shortfallMessage(date: string, amount: number): string {
  return `Il vous manquera ${formatF(amount)} le ${formatDate(date)}.`;
}

// No red zone in the horizon.
export function okMessage(): string {
  return "Vous avez de la marge ce mois-ci, tout est sous contrôle.";
}

// One-line reminder for a coming need.
export function nextDeadlineMessage(need: Need): string {
  return `Prochaine échéance : ${need.label}, ${formatF(need.amount)} le ${formatDate(need.dueDate)}.`;
}

// No need is due on or after `from`.
export function noDeadlineMessage(): string {
  return "Aucune échéance prévue. Vous pouvez souffler un instant.";
}

// The single main alert for the Accueil screen. Numbers come from the engine;
// only the wording is the fallback's. No LLM involved.
export function primaryAlert(state: AppState, from: string, to: string): string {
  const zones = redZones(forecast(state.profile, state.needs, state.debts, from, to));
  if (zones.length === 0) return okMessage();
  const first = zones[0];
  return shortfallMessage(first.from, -first.worstBalance);
}

// ---- Accueil notifications (docs/DESIGN.md §7) ----
// 1 to 3 concrete, sentence-form notifications generated from the real account
// state. Every number comes from the engine or the data; these templates only
// pick the wording. No LLM, no invented amount.
export type NotificationTone = "warn" | "info" | "good";

export interface HomeNotification {
  id: string;
  tone: NotificationTone;
  text: string;
}

// Human "9 days" with correct French singular/plural.
function sinceDays(days: number): string {
  return days <= 1 ? "1 jour" : `${days} jours`;
}

// Build the 1-3 home notifications. Warnings (coming red zone) first, then
// overdue client debts, then a single "all is fine" message when there is
// nothing to act on.
export function homeNotifications(
  state: AppState,
  todayStr: string,
  end: string,
): HomeNotification[] {
  const out: HomeNotification[] = [];
  const zones = redZones(forecast(state.profile, state.needs, state.debts, todayStr, end));

  if (zones.length > 0) {
    const first = zones[0];
    out.push({
      id: "zone",
      tone: "warn",
      text: shortfallMessage(first.from, -first.worstBalance),
    });
  }

  // Overdue unpaid debts, soonest first, capped so we never exceed 3 total.
  const overdue = state.debts
    .filter((d) => !d.paid && d.promisedDate < todayStr)
    .sort((a, b) => a.promisedDate.localeCompare(b.promisedDate))
    .slice(0, 3 - out.length);

  for (const debt of overdue) {
    out.push({
      id: `debt-${debt.id}`,
      tone: "info",
      text: `${debt.client} vous doit ${formatF(debt.amount)} depuis ${sinceDays(
        Math.max(0, daysBetween(debt.promisedDate, todayStr)),
      )}.`,
    });
  }

  // Nothing to act on: one reassuring message.
  if (out.length === 0) {
    out.push({ id: "ok", tone: "good", text: okMessage() });
  }

  return out.slice(0, 3);
}
