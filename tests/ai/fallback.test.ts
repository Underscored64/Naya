import { describe, it, expect } from "vitest";
import { homeNotifications } from "../../src/ai/fallback";
import { addDays } from "../../src/lib/dates";
import type { AppState } from "../../src/data/types";

describe("homeNotifications", () => {
  it("returns 1 to 3 notifications", () => {
    const from = "2026-01-01";
    const state = {
      initialBalance: 100000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      outflows: [{ id: "n", amount: 5000, date: addDays(from, 5), label: "Petit besoin" }],
      inflows: [],
    };
    const out = homeNotifications(state, from, addDays(from, 7));
    expect(out.length).toBeGreaterThanOrEqual(1);
    expect(out.length).toBeLessThanOrEqual(3);
  });

  it("flags a red zone with a warm tone when a big outflow is coming", () => {
    const from = "2026-01-01";
    const state: AppState = {
      initialBalance: 0,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
      outflows: [{ id: "rent", amount: 10000, date: addDays(from, 2), label: "Loyer" }],
      inflows: [],
    };
    const out = homeNotifications(state, from, addDays(from, 7));
    expect(out.some((n) => n.tone === "warn")).toBe(true);
  });

  it("reports a client's outstanding debt", () => {
    const from = "2026-01-01";
    const state: AppState = {
      initialBalance: 100000,
      clients: [{ id: "awa", name: "Awa" }],
      sales: [
        {
          id: "s",
          clientId: "awa",
          amountTotal: 50000,
          amountPaid: 30000,
          paymentMethod: "especes",
          source: "manuel",
        },
      ],
      expenses: [],
      repayments: [],
      outflows: [],
      inflows: [],
    };
    const out = homeNotifications(state, from, addDays(from, 7));
    // The debt notification names the amount in "FCFA" via formatF ("10 000 F").
    expect(out.some((n) => n.tone === "info" && n.text.includes("F"))).toBe(true);
  });
});
