import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AppState, PlannedOutflow } from "./types";
import { loadState, saveState, resetState } from "./store";

// A new planned outflow (a "besoin" of the month) entered from the UI.
export interface NewOutflow {
  label: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  recurring?: "weekly" | "monthly";
}

export interface AppStateContextValue {
  state: AppState;
  // Add a planned outflow ("besoin") to the forecast.
  addOutflow: (outflow: NewOutflow) => void;
  // Remove a planned outflow by id.
  removeOutflow: (id: string) => void;
  // Wipe to the demo data.
  reset: () => void;
}

// Sort items that carry a date ascending.
export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// One-letter id for a new row.
function newId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addOutflow = useCallback((outflow: NewOutflow) => {
    setState((prev) => ({
      ...prev,
      outflows: [
        ...prev.outflows,
        {
          id: newId(),
          amount: outflow.amount,
          date: outflow.date,
          label: outflow.label,
          recurring: outflow.recurring,
        },
      ],
    }));
  }, []);

  const removeOutflow = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      outflows: prev.outflows.filter((o: PlannedOutflow) => o.id !== id),
    }));
  }, []);

  const reset = useCallback(() => setState(resetState()), []);

  const value = useMemo(
    () => ({ state, addOutflow, removeOutflow, reset }),
    [state, addOutflow, removeOutflow, reset],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// Consumer hook; throws when used outside the provider.
export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
