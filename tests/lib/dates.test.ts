import { describe, expect, it } from "vitest";
import {
  addDays,
  daysBetween,
  eachDay,
  monthRange,
  today,
} from "../../src/lib/dates";

describe("dates", () => {
  it("addDays crosses month and year boundaries in UTC", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-02-28", 2)).toBe("2026-03-02"); // 2026 not a leap year
    expect(addDays("2024-02-29", 1)).toBe("2024-03-01"); // leap year
  });

  it("addDays supports negative and zero offsets", () => {
    expect(addDays("2026-11-05", -5)).toBe("2026-10-31");
    expect(addDays("2026-11-05", 0)).toBe("2026-11-05");
  });

  it("daysBetween is b - a in whole days", () => {
    expect(daysBetween("2026-11-01", "2026-11-01")).toBe(0);
    expect(daysBetween("2026-11-01", "2026-11-13")).toBe(12);
    expect(daysBetween("2026-11-13", "2026-11-01")).toBe(-12);
    expect(daysBetween("2026-10-31", "2026-11-01")).toBe(1);
  });

  it("eachDay is inclusive and handles reverse ranges", () => {
    expect(eachDay("2026-11-01", "2026-11-03")).toEqual([
      "2026-11-01",
      "2026-11-02",
      "2026-11-03",
    ]);
    expect(eachDay("2026-11-05", "2026-11-01")).toEqual([]);
    expect(eachDay("2026-11-30", "2026-12-02")).toEqual([
      "2026-11-30",
      "2026-12-01",
      "2026-12-02",
    ]);
  });

  it("monthRange returns the first and last day of a month", () => {
    expect(monthRange("2026-11-15")).toEqual({
      start: "2026-11-01",
      end: "2026-11-30",
    });
    expect(monthRange("2026-02-10")).toEqual({
      start: "2026-02-01",
      end: "2026-02-28",
    });
    expect(monthRange("2024-02-10")).toEqual({
      start: "2024-02-01",
      end: "2024-02-29",
    });
  });

  it("today returns a well-formed ISO date", () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
