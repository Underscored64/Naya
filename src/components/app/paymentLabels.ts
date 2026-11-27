import type { PaymentMethod, ExpenseCategory } from "../../data/types";

// Fixed UI labels for the schema's enum columns (docs/ARCHITECTURE_DONNEES.md).
export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "especes", label: "Espèces" },
  { id: "mobile_money", label: "Mobile money" },
];

export const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string }[] = [
  { id: "stock", label: "Stock" },
  { id: "transport", label: "Transport" },
  { id: "loyer", label: "Loyer" },
  { id: "scolarite", label: "Scolarité" },
  { id: "tontine", label: "Tontine" },
  { id: "autre", label: "Autre" },
];
