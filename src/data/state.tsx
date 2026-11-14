import { createContext, useContext, useEffect, useRef, useState } from "react";
import { loadState, resetDemo, saveState } from "./store";
import type { AppState, Need, Priority } from "./types";

// A freshly created need without an id (the provider assigns one).
export interface NewNeed {
  label: string;
  amount: number;
  dueDate: string;
  priority: Priority;
}

interface AppContextValue {
  state: AppState;
  addNeed: (need: NewNeed) => void;
  deleteNeed: (id: string) => void;
  reset: () => void;
}

const Ctx = createContext<AppContextValue | null>(null);

// Monotonic id so two needs added in the same tick never collide.
let seq = 0;
function newId(): string {
  seq += 1;
  return `need-${Date.now()}-${seq}`;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  // Persist on every change. We skip the very first write (the value that was
  // just loaded) so we do not round-trip the demo into storage needlessly.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saveState(state);
  }, [state]);

  const addNeed: AppContextValue["addNeed"] = (need) =>
    setState((s) => ({
      ...s,
      needs: [
        ...s.needs,
        { ...need, id: newId(), amount: Math.round(need.amount) },
      ],
    }));

  const deleteNeed: AppContextValue["deleteNeed"] = (id) =>
    setState((s) => ({ ...s, needs: s.needs.filter((n) => n.id !== id) }));

  const reset: AppContextValue["reset"] = () => setState(resetDemo());

  return (
    <Ctx.Provider value={{ state, addNeed, deleteNeed, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAppState(): AppContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

// Small shared helpers so the screens do not re-import engine pieces.
export function sortByDate<T extends { dueDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export type { AppState, Need };
