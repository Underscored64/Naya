// Core data model for Naya, aligned with the Supabase schema
// (docs/ARCHITECTURE_DONNEES.md). Money is always an integer amount of FCFA
// (no sub-unit). Row timestamps are "YYYY-MM-DD" strings.
//
// The engine (src/engine) only ever reads these row shapes; it never mutates
// them. Cancelled rows carry `deletedAt` and are ignored by every calculation.

export type PaymentMethod = "especes" | "mobile_money";

export type ExpenseCategory =
  | "stock"
  | "transport"
  | "loyer"
  | "scolarite"
  | "tontine"
  | "autre";

// Where a row came from: typed by hand or understood by the AI.
export type SaleSource = "manuel" | "ia";

// A person who owes the merchant money.
export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  deletedAt?: string | null;
}

// A sale. When amountPaid < amountTotal the remainder is automatically an
// outstanding debt for that client (a single row is enough).
export interface Sale {
  id: string;
  clientId?: string | null;
  amountTotal: number; // integer FCFA, > 0
  amountPaid: number; // integer FCFA, 0..amountTotal
  paymentMethod: PaymentMethod;
  note?: string | null;
  source: SaleSource;
  createdAt?: string; // "YYYY-MM-DDTHH:MM..." from the DB, when present
  deletedAt?: string | null;
}

// An outflow (a planned or actual spending).
export interface Expense {
  id: string;
  amount: number; // integer FCFA, > 0
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  note?: string | null;
  source: SaleSource;
  createdAt?: string; // "YYYY-MM-DDTHH:MM..." from the DB, when present
  deletedAt?: string | null;
}

// A repayment received from a client.
export interface Repayment {
  id: string;
  clientId: string;
  amount: number; // integer FCFA, > 0
  deletedAt?: string | null;
}

// One user's full snapshot. Fetched non-cancelled by the data layer; the engine
// filters cancelled rows again as a safety net.
export interface AccountData {
  initialBalance: number; // integer FCFA, the cash on hand at the start
  clients: Client[];
  sales: Sale[];
  expenses: Expense[];
  repayments: Repayment[];
}

// ---- Forward-looking forecast inputs --------------------------------------
// The forecast projects a daily balance over a window. Money coming in (future
// cash sales, planned client repayments) and money going out (declared
// recurring expenses) both carry the date they land on, so a recurring entry
// can be expanded across the window.

export type Recurrence = "weekly" | "monthly";

// Expected money coming in on `date`. `label` is the human name shown in the UI
// (e.g. the client who is due to pay).
export interface PlannedInflow {
  id: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  label?: string;
  recurring?: Recurrence;
}

// A declared outflow on `date` (e.g. stock restock, rent, tuition).
export interface PlannedOutflow {
  id: string;
  amount: number;
  date: string; // "YYYY-MM-DD"
  label?: string;
  recurring?: Recurrence;
}

// The full state the engine and the in-memory UI work on.
export interface AppState extends AccountData {
  inflows: PlannedInflow[];
  outflows: PlannedOutflow[];
}
