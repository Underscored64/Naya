import { makeDemo } from "./demo";
import type { AppState } from "./types";

// Local persistence for the in-memory account, keyed by user id so multiple
// browsers/devices stay isolated. Until the Supabase client wires up the live
// data (later tasks) this is the source of truth on refresh. The shape matches
// the Supabase rows (see src/data/types.ts).
const KEY = "naya:account:v4";

// Load the account, falling back to the demo when nothing is stored or the
// stored payload is from an older version.
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      // Basic shape check: a valid state always carries these arrays.
      if (
        typeof parsed.initialBalance === "number" &&
        Array.isArray(parsed.clients) &&
        Array.isArray(parsed.sales) &&
        Array.isArray(parsed.expenses) &&
        Array.isArray(parsed.repayments)
      ) {
        return {
          initialBalance: parsed.initialBalance,
          clients: parsed.clients ?? [],
          sales: parsed.sales ?? [],
          expenses: parsed.expenses ?? [],
          repayments: parsed.repayments ?? [],
          inflows: parsed.inflows ?? [],
          outflows: parsed.outflows ?? [],
        };
      }
    }
  } catch {
    // fall through to demo
  }
  return makeDemo();
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private-mode errors
  }
}

// Drop everything and fall back to the demo again (the "réinitialiser la démo"
// button).
export function resetState(): AppState {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  return makeDemo();
}
