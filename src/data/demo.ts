import type {
  AccountData,
  AppState,
  Client,
  Expense,
  PlannedInflow,
  PlannedOutflow,
  Repayment,
  Sale,
} from "./types";

// Fixed reference date for the demo so the forecast / suggestion tests are
// reproducible (the real UI uses the live "today"). The demo tells the "you can
// make it" story: a brief red zone on 12-10/12-11 that Esi's repayment on 12-12
// clears.
const T = "2026-12-01";
const d = (n: number) => `${T.slice(0, 8)}${String(n).padStart(2, "0")}`;

const clients: Client[] = [
  { id: "awa", name: "Awa", phone: "+228 90 00 00 01" },
  { id: "esi", name: "Esi", phone: "+228 91 11 11 12" },
];

const sales: Sale[] = [
  // Awa buys 50,000, pays 30,000 now, owes 20,000.
  {
    id: "s-awa",
    clientId: "awa",
    amountTotal: 50000,
    amountPaid: 30000,
    paymentMethod: "especes",
    source: "manuel",
  },
  // Esi buys 40,000 on credit, pays nothing now, owes 40,000.
  {
    id: "s-esi",
    clientId: "esi",
    amountTotal: 40000,
    amountPaid: 0,
    paymentMethod: "mobile_money",
    source: "ia",
  },
];

const expenses: Expense[] = [
  { id: "e-transport", amount: 3000, category: "transport", paymentMethod: "especes", source: "manuel" },
];

const repayments: Repayment[] = [
  { id: "r-awa", clientId: "awa", amount: 10000 },
];

// Forward-looking entries that drive the forecast over the demo window.
const inflows: PlannedInflow[] = [
  { id: "in-awa", amount: 10000, date: d(18), label: "Awa" },
  { id: "in-esi", amount: 40000, date: d(12), label: "Esi" },
];

const outflows: PlannedOutflow[] = [
  { id: "out-stock", amount: 80000, date: d(10), label: "Réapprovisionnement" },
  { id: "out-loyer", amount: 30000, date: d(15), label: "Loyer" },
];

export function makeDemo(_today = T): AppState {
  return {
    initialBalance: 70000,
    clients,
    sales,
    expenses,
    repayments,
    inflows,
    outflows,
  };
}

// Account-only view (no planned entries), matching a Supabase row snapshot.
export function makeDemoAccount(_today = T): AccountData {
  return {
    initialBalance: 70000,
    clients,
    sales,
    expenses,
    repayments,
  };
}
