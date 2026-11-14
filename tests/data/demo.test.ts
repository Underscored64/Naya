import { describe, expect, it } from "vitest";
import { makeDemo } from "../../src/data/demo";
import { addDays, daysBetween } from "../../src/lib/dates";

// Demo for "Ama". Money is integer FCFA; the first restock lands ~day 12 so that,
// with no action, the balance dips negative there (a red zone for the forecast).
describe("demo data", () => {
  const t = "2026-11-01";
  const state = makeDemo(t);

  it("keeps money as integers and dates as ISO strings", () => {
    expect(state.profile.openingBalance).toBe(38000);
    expect(state.profile.avgDailySales).toBe(4000);
    for (const n of state.needs) {
      expect(Number.isInteger(n.amount)).toBe(true);
      expect(n.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    for (const d of state.debts) {
      expect(Number.isInteger(d.amount)).toBe(true);
      expect(d.promisedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("has the expected needs and debts", () => {
    const byLabel = state.needs.find((n) => n.label === "Scolarité");
    expect(byLabel?.amount).toBe(25000);
    expect(byLabel?.priority).toBe("indispensable");
    const tontine = state.needs.find((n) => n.label === "Tontine");
    expect(tontine?.amount).toBe(10000);
    expect(tontine?.priority).toBe("important");
    const pagne = state.needs.find((n) => n.label === "Pagne");
    expect(pagne?.amount).toBe(15000);
    expect(pagne?.priority).toBe("confort");
    const restocks = state.needs.filter((n) => n.label === "Réapprovisionnement");
    expect(restocks).toHaveLength(2);
    expect(restocks.every((n) => n.amount === 45000)).toBe(true);
    expect(restocks.every((n) => n.recurring === "weekly")).toBe(true);

    const esi = state.debts.find((d) => d.client === "Esi");
    expect(esi?.amount).toBe(12000);
    expect(daysBetween(t, esi!.promisedDate)).toBe(3);
    const kofi = state.debts.find((d) => d.client === "Kofi");
    expect(kofi?.amount).toBe(3000);
    expect(daysBetween(t, kofi!.promisedDate)).toBe(5);
    const akouvi = state.debts.find((d) => d.client === "Akouvi");
    expect(akouvi?.amount).toBe(8000);
    expect(daysBetween(t, akouvi!.promisedDate)).toBe(9);
  });

  it("generates dates relative to the given day", () => {
    const a = makeDemo("2026-11-01");
    const b = makeDemo("2027-01-04");
    expect(daysBetween(a.needs[0].dueDate, b.needs[0].dueDate)).toBe(
      daysBetween("2026-11-01", "2027-01-04"),
    );
    expect(daysBetween("2027-01-04", addDays("2027-01-04", 12))).toBe(12);
  });
});
