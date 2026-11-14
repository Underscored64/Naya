// Standard (non-AI) messages for Naya. The app must work with the LLM off, so
// every screen has a deterministic French message it can show on its own.
// Numbers always come from the engine or from the user's input — these
// templates only pick the wording, never invent an amount.

import { forecast, redZones } from "../engine/forecast";
import type { AppState, Need } from "../data/types";
import { formatDate, formatF } from "../lib/format";

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
