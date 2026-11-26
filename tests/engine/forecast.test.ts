import { describe, it, expect } from "vitest";
import { forecast, redZones } from "../../src/engine/forecast";
import type { AccountData } from "../../src/data/types";

// A 3-day window in January 2026.
const range = { from: "2026-01-01", to: "2026-01-03" };

describe("forecast", () => {
  it("starts from the initial balance and applies inflows/outflows by day", () => {
    const account: AccountData = {
      initialBalance: 50000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
    };
    const outflows = [{ id: "n1", amount: 10000, date: "2026-01-05" }];
    const days = forecast(account, [], outflows, range.from, range.to);
    expect(days).toHaveLength(3);
    expect(days[0].balance).toBe(50000);
    expect(days[2].balance).toBe(50000);
  });

  it("dips the balance on a day with an outflow", () => {
    const account: AccountData = {
      initialBalance: 1000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
    };
    const outflows = [{ id: "n1", amount: 5000, date: "2026-01-03" }];
    const days = forecast(account, [], outflows, range.from, range.to);
    expect(days[0].balance).toBe(1000);
    expect(days[2].balance).toBe(-4000);
  });

  it("reports a red zone over consecutive negative days", () => {
    const account: AccountData = {
      initialBalance: 0,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
    };
    const outflows = [
      { id: "n1", amount: 100, date: "2026-01-02" },
      { id: "n2", amount: 100, date: "2026-01-03" },
    ];
    const days = forecast(account, [], outflows, range.from, range.to);
    const zones = redZones(days);
    expect(zones).toHaveLength(1);
    expect(zones[0].from).toBe("2026-01-02");
    expect(zones[0].to).toBe("2026-01-03");
    expect(zones[0].worstBalance).toBe(-200);
  });

  it("expands a recurring weekly outflow across the window", () => {
    const account: AccountData = {
      initialBalance: 100000,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
    };
    // 30 days from 2026-01-01: a weekly outflow of 1000 lands on the 1st only
    // (the 8th is out of range).
    const outflows = [{ id: "n1", amount: 1000, date: "2026-01-01", recurring: "weekly" as const }];
    // 14 days = indices 0..13.
    const days = forecast(account, [], outflows, "2026-01-01", "2026-01-14");
    expect(days).toHaveLength(14);
    expect(days[0].balance).toBe(99000);
    // 7 days later (01-08, index 7) it repeats.
    expect(days[7].balance).toBe(98000);
    // 14 days later would be out of range; the last day still holds the value.
    expect(days[13].balance).toBe(98000);
  });

  it("counts only unpaid planned inflows (a client who still owes)", () => {
    const account: AccountData = {
      initialBalance: 0,
      clients: [],
      sales: [],
      expenses: [],
      repayments: [],
    };
    const inflows = [
      { id: "esi", amount: 5000, date: "2026-01-04", label: "Esi" },
      { id: "kofi", amount: 2000, date: "2026-01-04", label: "Kofi" },
    ];
    const days = forecast(account, inflows, [], range.from, "2026-01-05");
    // 01-04 both arrive on the same day.
    expect(days[3].inflow).toBe(7000);
    expect(days[3].balance).toBe(7000);
    expect(days[4].balance).toBe(7000);
  });
});
