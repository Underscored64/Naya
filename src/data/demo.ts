import { addDays } from "../lib/dates";
import type { AppState, Debt, Need, Profile, Sale } from "./types";

// Build a fictional month for the merchant "Ama", relative to `todayStr`.
// Numbers are tuned so that, without any action, the running balance dips
// negative around day 12 (first red zone). See docs/tasks/03-data.md.

let counter = 0;
function id(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

export function makeDemo(todayStr: string): AppState {
  counter = 0;
  const d = (n: number) => addDays(todayStr, n);

  const profile: Profile = {
    openingBalance: 38000,
    avgDailySales: 4000,
  };

  // Weekly restock at day 12 and 26 (indispensable).
  // Tuition day 5, tontine day 14, a pagne day 24 (confort).
  const needs: Need[] = [
    { id: id("need"), label: "Réapprovisionnement", amount: 45000, dueDate: d(12), priority: "indispensable", recurring: "weekly" },
    { id: id("need"), label: "Réapprovisionnement", amount: 45000, dueDate: d(26), priority: "indispensable", recurring: "weekly" },
    { id: id("need"), label: "Scolarité", amount: 25000, dueDate: d(5), priority: "indispensable" },
    { id: id("need"), label: "Tontine", amount: 10000, dueDate: d(14), priority: "important", recurring: "monthly" },
    { id: id("need"), label: "Pagne", amount: 15000, dueDate: d(24), priority: "confort" },
  ];

  // Debts at their promised dates: Esi +3, Kofi +5, Akouvi +9.
  const debts: Debt[] = [
    { id: id("debt"), client: "Esi", amount: 12000, promisedDate: d(3), paid: false },
    { id: id("debt"), client: "Kofi", amount: 3000, promisedDate: d(5), paid: false },
    { id: id("debt"), client: "Akouvi", amount: 8000, promisedDate: d(9), paid: false },
  ];

  const sales: Sale[] = [];

  return { profile, needs, debts, sales };
}
