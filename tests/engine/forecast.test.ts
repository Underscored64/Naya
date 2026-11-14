import { describe, it, expect } from "vitest";
import { forecast, redZones } from "../../src/engine/forecast";
import type { Debt, Need } from "../../src/data/types";

describe("forecast", () => {
  it("stays positive when inflow covers outflow (no shortfall)", () => {
    const p = { openingBalance: 50000, avgDailySales: 5000 };
    const n: Need[] = [{ id: "n1", label: "Scolarité", amount: 10000, dueDate: "2026-01-05", priority: "indispensable" }];
    const d: Debt[] = [];
    const days = forecast(p, n, d, "2026-01-01", "2026-01-07");
    expect(days).toHaveLength(7);
    expect(days[0].inflow).toBe(5000);
    // balance only drops on the 5th
    expect(days[3].balance).toBe(70000);
    expect(days[4].balance).toBe(65000);
    for (const day of days) expect(day.balance).toBeGreaterThan(0);
  });

  it("shows a shortfall on one given day", () => {
    const p = { openingBalance: 1000, avgDailySales: 0 };
    const n: Need[] = [{ id: "n1", label: "Loyer", amount: 5000, dueDate: "2026-01-03", priority: "indispensable" }];
    const d: Debt[] = [];
    const days = forecast(p, n, d, "2026-01-01", "2026-01-05");
    expect(days[0].balance).toBe(1000);
    expect(days[2].outflow).toBe(5000);
    expect(days[2].balance).toBe(1000 - 5000);
  });

  it("merges two consecutive red days into one zone", () => {
    const p = { openingBalance: 0, avgDailySales: 0 };
    const n: Need[] = [
      { id: "n1", label: "A", amount: 100, dueDate: "2026-01-02", priority: "confort" },
      { id: "n2", label: "B", amount: 100, dueDate: "2026-01-03", priority: "confort" },
    ];
    const d: Debt[] = [];
    const days = forecast(p, n, d, "2026-01-01", "2026-01-03");
    const zones = redZones(days);
    expect(zones).toHaveLength(1);
    expect(zones[0].from).toBe("2026-01-02");
    expect(zones[0].to).toBe("2026-01-03");
    expect(zones[0].worstBalance).toBe(-200);
  });

  it("counts a weekly recurring need every week in range", () => {
    const p = { openingBalance: 100000, avgDailySales: 0 };
    const n: Need[] = [{ id: "n1", label: "Stock", amount: 1000, dueDate: "2026-01-03", priority: "indispensable", recurring: "weekly" }];
    const d: Debt[] = [];
    const days = forecast(p, n, d, "2026-01-01", "2026-01-31");
    // outflow 1000 on 01-03, 01-10, 01-17, 01-24, 01-31
    const outflowDays = days.filter((x) => x.outflow > 0).map((x) => x.date);
    expect(outflowDays).toEqual(["2026-01-03", "2026-01-10", "2026-01-17", "2026-01-24", "2026-01-31"]);
  });

  it("ignores a paid debt", () => {
    const p = { openingBalance: 0, avgDailySales: 0 };
    const n: Need[] = [];
    const d: Debt[] = [
      { id: "d1", client: "Esi", amount: 5000, promisedDate: "2026-01-04", paid: true },
      { id: "d2", client: "Kofi", amount: 2000, promisedDate: "2026-01-04", paid: false },
    ];
    const days = forecast(p, n, d, "2026-01-01", "2026-01-05");
    expect(days[3].inflow).toBe(2000); // only the unpaid debt
  });
});
