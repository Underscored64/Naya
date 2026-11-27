import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import type {
  Sale,
  Expense,
  Client,
  Repayment,
  PaymentMethod,
  ExpenseCategory,
} from "./types";

// A merchant profile row. One per auth user; RLS keeps every user's row
// isolated (they can only ever read or write their own line).
export interface ProfileRow {
  user_id: string;
  display_name: string;
  business_name: string | null;
  created_at: string;
}

// TanStack Query keys, shared so we can invalidate in one place.
export const queries = {
  profile: ["profile", "me"] as const,
  sales: ["sales"] as const,
  expenses: ["expenses"] as const,
  clients: ["clients"] as const,
  repayments: ["repayments"] as const,
};

// --- Row <-> engine mappings -------------------------------------------------
// Supabase returns snake_case columns; the engine works on camelCase types
// (src/data/types.ts). Money stays an integer of FCFA end-to-end.

interface SaleRow {
  id: string;
  client_id: string | null;
  amount_total: number;
  amount_paid: number;
  payment_method: PaymentMethod;
  note: string | null;
  source: Sale["source"];
  created_at: string;
  deleted_at: string | null;
}

function toSale(row: SaleRow): Sale {
  return {
    id: row.id,
    clientId: row.client_id,
    amountTotal: row.amount_total,
    amountPaid: row.amount_paid,
    paymentMethod: row.payment_method,
    note: row.note,
    source: row.source,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

interface ExpenseRow {
  id: string;
  amount: number;
  category: ExpenseCategory;
  payment_method: PaymentMethod;
  note: string | null;
  source: Expense["source"];
  created_at: string;
  deleted_at: string | null;
}

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    amount: row.amount,
    category: row.category,
    paymentMethod: row.payment_method,
    note: row.note,
    source: row.source,
    createdAt: row.created_at,
    deletedAt: row.deleted_at,
  };
}

// --- Read hooks --------------------------------------------------------------
// Each read filters `deleted_at is null` (cancelled rows stay invisible to the
// UI) and orders most-recent first. RLS scopes every row to auth.uid().

// The user's sales, newest first.
export function useSales() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queries.sales,
    queryFn: async (): Promise<Sale[]> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(0, 499);
      if (error) throw error;
      return (data as SaleRow[]).map(toSale);
    },
    enabled: user !== null,
  });
}

// The user's expenses, newest first.
export function useExpenses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queries.expenses,
    queryFn: async (): Promise<Expense[]> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(0, 499);
      if (error) throw error;
      return (data as ExpenseRow[]).map(toExpense);
    },
    enabled: user !== null,
  });
}

// The user's clients, newest first — feeds the optional client picker.
export function useClients() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queries.clients,
    queryFn: async (): Promise<Client[]> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, phone, deleted_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Client[]).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        deletedAt: null,
      }));
    },
    enabled: user !== null,
  });
}

// --- Write hooks -------------------------------------------------------------
// Inputs already carry integer FCFA amounts. RLS's "own rows" policy pins
// every insert to auth.uid(), so the only field the front sets is user_id.

// What the "Nouvelle vente" form submits (amounts are integers, FCFA).
export interface NewSaleInput {
  amountTotal: number;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  clientId?: string | null;
  note?: string | null;
}

// What the "Nouvelle dépense" form submits (amount is an integer, FCFA).
export interface NewExpenseInput {
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  note?: string | null;
}

// Create a sale, then drop the cached list so it refreshes with the new row.
export function useCreateSale() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewSaleInput): Promise<Sale> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("sales")
        .insert({
          user_id: user.id,
          client_id: input.clientId ?? null,
          amount_total: input.amountTotal,
          amount_paid: input.amountPaid,
          payment_method: input.paymentMethod,
          note: input.note ?? null,
          source: "manuel",
        })
        .select()
        .single();
      if (error) throw error;
      return toSale(data as SaleRow);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queries.sales });
    },
  });
}

// Create an expense, then drop the cached list so it refreshes with the new row.
export function useCreateExpense() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewExpenseInput): Promise<Expense> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          amount: input.amount,
          category: input.category,
          payment_method: input.paymentMethod,
          note: input.note ?? null,
          source: "manuel",
        })
        .select()
        .single();
      if (error) throw error;
      return toExpense(data as ExpenseRow);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queries.expenses });
    },
  });
}

// A brand-new user gets a `profiles` row created automatically by a Postgres
// trigger on `auth.users` (see supabase/schema.sql) which reads `display_name`
// from the user metadata passed at sign-up. This upsert is the write primitive
// for later edits (e.g. changing the display name in Settings).
export async function upsertProfile(
  userId: string,
  displayName: string,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, display_name: displayName }, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

// Read the current user's profile through TanStack Query (cached, revalidated).
export function useProfile() {
  return useQuery({
    queryKey: queries.profile,
    queryFn: async (): Promise<ProfileRow> => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session?.user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("profile-not-found");
      return data as ProfileRow;
    },
  });
}

// Revalidate the cached profile after a write elsewhere in the app.
export function useRefreshProfile() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queries.profile });
}

// ---- Clients & repayments (task 07) --------------------------------------
//
// A client owes what they have not yet returned. The engine's computeClientDebt
// derives that from sales + repayments; these hooks only read/write those rows.
// RLS (`auth.uid() = user_id`) isolates every user's rows, so no user_id is
// supplied here — matching the sales/expenses inserts above.

// A repayment as the engine expects it (camelCase).
function mapRepayment(row: {
  id: string;
  client_id: string;
  amount: number;
  deleted_at?: string | null;
}): Repayment {
  return {
    id: row.id,
    clientId: row.client_id,
    amount: row.amount,
    deletedAt: row.deleted_at ?? null,
  };
}

// All repayments the user owns, newest first. Non-cancelled only: a physical
// delete is impossible, corrections mark `deleted_at` instead.
export function useRepayments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queries.repayments,
    queryFn: async (): Promise<Repayment[]> => {
      if (!user) throw new Error("not-authenticated");
      const { data, error } = await supabase
        .from("repayments")
        .select("id, client_id, amount, deleted_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRepayment);
    },
    enabled: user !== null,
  });
}

// Create a client by name. `phone` is optional.
export interface NewClientInput {
  name: string;
  phone?: string | null;
}

export function useCreateClient() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewClientInput): Promise<Client> => {
      if (!user) throw new Error("not-authenticated");
      const row = {
        user_id: user.id,
        name: input.name,
        phone: input.phone?.trim() ? input.phone.trim() : null,
      };

      const { data, error } = await supabase
        .from("clients")
        .insert(row)
        .select("id, name, phone, deleted_at")
        .single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        deletedAt: data.deleted_at ?? null,
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queries.clients });
    },
  });
}

// Record a repayment received from a client. `amount` is an integer FCFA, > 0.
// A repayment only touches the `repayments` rows, so it revalidates them; the
// Dettes screen recomputes each client's debt from sales + repayments.
export interface NewRepaymentInput {
  clientId: string;
  amount: number;
}

export function useCreateRepayment() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewRepaymentInput): Promise<Repayment> => {
      if (!user) throw new Error("not-authenticated");
      const row = {
        user_id: user.id,
        client_id: input.clientId,
        amount: input.amount,
      };

      const { data, error } = await supabase
        .from("repayments")
        .insert(row)
        .select("id, client_id, amount, deleted_at")
        .single();
      if (error) throw error;
      return mapRepayment(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queries.repayments });
    },
  });
}
