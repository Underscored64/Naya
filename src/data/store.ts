import { today } from "../lib/dates";
import { makeDemo } from "./demo";
import type { AppState } from "./types";

const KEY = "naya.state.v1";

// Load the saved state, or fall back to the demo (Ama) when nothing is saved or
// the stored JSON is unreadable/corrupt. Every localStorage access is guarded.
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return makeDemo(today());
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.profile || !Array.isArray(parsed.needs) || !Array.isArray(parsed.debts)) {
      return makeDemo(today());
    }
    return { ...parsed, sales: Array.isArray(parsed.sales) ? parsed.sales : [] };
  } catch {
    return makeDemo(today());
  }
}

// Persist the state. Failures (e.g. storage disabled) are swallowed so the app
// never crashes; the in-memory state keeps working for the session.
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// Reset to a fresh demo state (dates relative to today) and persist it.
export function resetDemo(): AppState {
  const state = makeDemo(today());
  saveState(state);
  return state;
}
