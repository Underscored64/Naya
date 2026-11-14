import { describe, it, expect } from "vitest";
import { suggest } from "../../src/engine/suggest";
import type { AppState } from "../../src/data/types";

// The range ends on 01-03, so postponing a day-03 need past 01-03 moves its
// outflow out of the forecast entirely and clears the red zone.
const range = { from: "2026-01-01", to: "2026-01-03" };

// "Pagne" (confort) alone tips the balance negative on 01-03. "Tontine"
// (important) is postponable but does not by itself create the zone. "Loyer"
// (indispensable) is never proposed for postponement. Esi is promised before the
// first red day, so she earns a reminder.
function makeState(): AppState {
  return {
    profile: { openingBalance: 10000, avgDailySales: 0 },
    needs: [
      { id: "loan", label: "Loyer", amount: 1000, dueDate: "2026-01-02", priority: "indispensable" },
      { id: "pagne", label: "Pagne", amount: 20000, dueDate: "2026-01-03", priority: "confort" },
      { id: "tontine", label: "Tontine", amount: 100, dueDate: "2026-01-03", priority: "important" },
    ],
    debts: [{ id: "esi", client: "Esi", amount: 5000, promisedDate: "2026-01-02", paid: false }],
    sales: [],
  };
}

describe("suggest", () => {
  it("postponing the 'confort' need removes the red zone", () => {
    const pagne = suggest(makeState(), range).find((s) => s.kind === "postpone" && s.targetId === "pagne");
    expect(pagne).toBeDefined();
    expect(pagne!.resolvesShortfall).toBe(true);
  });

  it("never proposes to postpone an 'indispensable' need", () => {
    const suggestions = suggest(makeState(), range);
    expect(suggestions.some((s) => s.kind === "postpone" && s.targetId === "loan")).toBe(false);
  });

  it("postpones 'confort' before 'important'", () => {
    const postpones = suggest(makeState(), range).filter((s) => s.kind === "postpone");
    expect(postpones[0].targetId).toBe("pagne");
    expect(postpones[1].targetId).toBe("tontine");
  });

  it("proposes a reminder for a client promised before the first red day", () => {
    const reminders = suggest(makeState(), range).filter((s) => s.kind === "remind");
    expect(reminders.some((s) => s.targetId === "esi")).toBe(true);
  });

  it("returns no suggestions when there is no red zone", () => {
    const state: AppState = {
      profile: { openingBalance: 50000, avgDailySales: 5000 },
      needs: [{ id: "pagne", label: "Pagne", amount: 1000, dueDate: "2026-01-03", priority: "confort" }],
      debts: [],
      sales: [],
    };
    expect(suggest(state, range)).toHaveLength(0);
  });
});
