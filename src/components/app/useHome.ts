import { useSales, useExpenses, useRepayments, useClients } from "../../data/queries";
import type { HomeRows } from "./home";

// The home's data, pulled from the real account via the existing Supabase read
// hooks. Every list already filters cancelled rows and scopes to the user by
// RLS. The home only reads these; it never writes.
export function useHome(): { rows: HomeRows; loading: boolean } {
  const { data: sales, isLoading: a } = useSales();
  const { data: expenses, isLoading: b } = useExpenses();
  const { data: repayments, isLoading: c } = useRepayments();
  const { data: clients, isLoading: d } = useClients();

  const rows: HomeRows = {
    sales: sales ?? [],
    expenses: expenses ?? [],
    repayments: repayments ?? [],
    clients: clients ?? [],
  };

  return { rows, loading: a || b || c || d };
}
