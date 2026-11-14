import { describe, it, expect } from "vitest";
import {
  shortfallMessage,
  okMessage,
  nextDeadlineMessage,
  noDeadlineMessage,
  primaryAlert,
} from "../../src/ai/fallback";
import { today, addDays } from "../../src/lib/dates";
import type { AppState } from "../../src/data/types";

// A green state: enough cash and sales, a small need -> no red zone.
function greenState(): AppState {
  const from = today();
  return {
    profile: { openingBalance: 100000, avgDailySales: 10000 },
    needs: [{ id: "n", label: "Petit besoin", amount: 5000, dueDate: addDays(from, 5), priority: "confort" }],
    debts: [],
    sales: [],
  };
}

// A red state: no cash, no sales, a big need -> a red zone.
function redState(): AppState {
  const from = today();
  return {
    profile: { openingBalance: 0, avgDailySales: 0 },
    needs: [{ id: "n", label: "Loyer", amount: 50000, dueDate: addDays(from, 3), priority: "indispensable" }],
    debts: [],
    sales: [],
  };
}

describe("ai/fallback (standard messages)", () => {
  it("shortfallMessage echoes the given amount and date, nothing invented", () => {
    const msg = shortfallMessage("2026-11-05", 45000);
    expect(msg).toContain("manquera");
    expect(msg).toContain("45");
    expect(msg).toContain("000");
  });

  it("primaryAlert flags the first red zone when one exists", () => {
    const from = today();
    const msg = primaryAlert(redState(), from, addDays(from, 35));
    expect(msg).toContain("manquera");
    expect(msg).toContain("50");
    expect(msg).toContain("000");
  });

  it("primaryAlert says OK when there is no red zone", () => {
    const from = today();
    expect(primaryAlert(greenState(), from, addDays(from, 35))).toBe(okMessage());
  });

  it("nextDeadlineMessage echoes only the need's amount and date", () => {
    const msg = nextDeadlineMessage({
      id: "x",
      label: "Scolarité",
      amount: 25000,
      dueDate: "2026-11-05",
      priority: "indispensable",
    });
    expect(msg).toContain("Scolarité");
    expect(msg).toContain("25");
    expect(msg).toContain("000");
  });

  it("noDeadlineMessage is a calm fallback", () => {
    expect(noDeadlineMessage()).toContain("Aucune échéance");
  });
});
