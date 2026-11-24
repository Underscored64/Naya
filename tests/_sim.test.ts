import { describe, it } from "vitest";
import { makeDemo } from "../src/data/demo";
import { forecast, redZones } from "../src/engine/forecast";
import { suggest } from "../src/engine/suggest";
import { addDays, monthRange } from "../src/lib/dates";
import type { Range } from "../src/engine/forecast";

describe("current demo trace", () => {
  it("full", () => {
    const t = "2026-11-01";
    const s = makeDemo(t);
    const mr = monthRange(t); // what MonthSummary uses
    const range: Range = { from: mr.start, to: mr.end };
    console.log("RANGE", range.from, "->", range.to);
    console.log("profile", JSON.stringify(s.profile));
    console.log("needs", s.needs.map((n) => `${n.id}:${n.label}:${n.amount}:${n.dueDate}:${n.priority}:${n.recurring ?? "-"}`).join(" | "));
    console.log("debts", s.debts.map((d) => `${d.id}:${d.client}:${d.amount}:${d.promisedDate}`).join(" | "));
    const days = forecast(s.profile, s.needs, s.debts, range.from, range.to);
    console.log("DAYS:");
    for (const day of days) console.log(day.date, "bal", day.balance, "in", day.inflow, "out", day.outflow);
    console.log("ZONES", JSON.stringify(redZones(days)));
    console.log("SUGG", JSON.stringify(suggest(s, range), null, 0));
    for (const sug of suggest(s, range)) {
      const needs = s.needs.map((n) => (n.id === sug.targetId ? { ...n, dueDate: addDays(n.dueDate, 7) } : n));
      console.log("postpone", sug.targetId, "->", JSON.stringify(redZones(forecast(s.profile, needs, s.debts, range.from, range.to))));
    }
  });
});
