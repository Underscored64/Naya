import { useSales, useExpenses } from "../../data/queries";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "./paymentLabels";
import SaleForm from "./SaleForm";
import ExpenseForm from "./ExpenseForm";

const METHOD_LABEL = new Map(PAYMENT_METHODS.map((m) => [m.id, m.label]));
const CATEGORY_LABEL = new Map(EXPENSE_CATEGORIES.map((c) => [c.id, c.label]));

// True when a created_at timestamp fell on today's calendar day.
function isToday(iso: string | undefined): boolean {
  return iso?.slice(0, 10) === today();
}

// A simple screen that verifies sales/expenses reach Supabase: it hosts the two
// entry forms and lists today's rows (the queries already return newest-first,
// filtered to non-cancelled). Not the final home yet.
export default function Saisie() {
  const { data: sales, isLoading: salesLoading, error: salesError } = useSales();
  const { data: expenses, isLoading: expLoading, error: expError } = useExpenses();

  const todaySales = (sales ?? []).filter((s) => isToday(s.createdAt));
  const todayExpenses = (expenses ?? []).filter((e) => isToday(e.createdAt));

  return (
    <section className="app-screen" aria-label="Saisie">
      <SaleForm />
      <ExpenseForm />

      <div className="app-today">
        <h2 className="app-today__title">Ventes du jour</h2>
        {salesError ? (
          <p className="app-today__empty">Impossible de charger les ventes.</p>
        ) : !salesLoading && todaySales.length === 0 ? (
          <p className="app-today__empty">Aucune vente enregistrée aujourd'hui.</p>
        ) : (
          <ul className="app-today__list">
            {todaySales.map((s) => (
              <li key={s.id} className="glass-row app-today__row">
                <span className="app-today__label">
                  Vente · {METHOD_LABEL.get(s.paymentMethod)}
                  {s.amountPaid < s.amountTotal ? " (partielle)" : ""}
                </span>
                <span className="app-today__amount">{formatF(s.amountPaid)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="app-today">
        <h2 className="app-today__title">Dépenses du jour</h2>
        {expError ? (
          <p className="app-today__empty">Impossible de charger les dépenses.</p>
        ) : !expLoading && todayExpenses.length === 0 ? (
          <p className="app-today__empty">Aucune dépense enregistrée aujourd'hui.</p>
        ) : (
          <ul className="app-today__list">
            {todayExpenses.map((e) => (
              <li key={e.id} className="glass-row app-today__row">
                <span className="app-today__label">
                  {CATEGORY_LABEL.get(e.category)} · {METHOD_LABEL.get(e.paymentMethod)}
                </span>
                <span className="app-today__amount">{formatF(e.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
