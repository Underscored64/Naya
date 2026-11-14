// Core data model for Naya.
// Money is always an integer amount of FCFA. Dates are "YYYY-MM-DD" strings.

export type Priority = "indispensable" | "important" | "confort";

// A planned outflow (a need or a purchase).
export interface Need {
  id: string;
  label: string;
  amount: number; // integer FCFA
  dueDate: string; // "YYYY-MM-DD"
  priority: Priority;
  recurring?: "weekly" | "monthly";
}

// Money owed to the merchant by a client.
export interface Debt {
  id: string;
  client: string;
  amount: number; // integer FCFA
  promisedDate: string; // "YYYY-MM-DD"
  paid: boolean;
}

// A sale on a given day. If paidAmount < amount, the remainder becomes a Debt.
export interface Sale {
  id: string;
  date: string; // "YYYY-MM-DD"
  label: string;
  amount: number; // integer FCFA
  clientName?: string;
  paidAmount: number; // integer FCFA
}

// Merchant profile.
export interface Profile {
  openingBalance: number; // cash available today, integer FCFA
  avgDailySales: number; // usual cash sales per day, integer FCFA
}

// A full saved state of the app.
export interface AppState {
  profile: Profile;
  needs: Need[];
  debts: Debt[];
  sales: Sale[];
}
