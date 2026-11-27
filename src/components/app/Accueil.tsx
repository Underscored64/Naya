import { AlertTriangle, Info, CheckCircle, Sparkles, Wallet, TrendingUp } from "lucide-react";
import { useHome } from "./useHome";
import { useSales, useExpenses } from "../../data/queries";
import { homeNotifications, currentBalance, balanceSeries, isEmpty } from "./home";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from "./paymentLabels";
import MonthSummary from "./MonthSummary";
import type { HomeNotification, NotificationTone } from "../../ai/fallback";

// Icon + pill modifier per notification tone (docs/DESIGN.md §7).
const TONE_ICON: Record<NotificationTone, typeof AlertTriangle> = {
  warn: AlertTriangle,
  info: Info,
  good: CheckCircle,
};
const TONE_CLASS: Record<NotificationTone, string> = {
  warn: "icon-pill--warn",
  info: "icon-pill--info",
  good: "icon-pill--positive",
};

const METHOD_LABEL = new Map(PAYMENT_METHODS.map((m) => [m.id, m.label]));
const CATEGORY_LABEL = new Map(EXPENSE_CATEGORIES.map((c) => [c.id, c.label]));

function isToday(iso: string | undefined | null): boolean {
  return iso?.slice(0, 10) === today();
}

// The home screen, built from real data. Order matters (docs/DESIGN.md §6, §7):
// 1) 1–3 concrete notifications, 2) the month summary card, 3) glass-row lists.
// A brand-new account shows a warm invite instead of an empty, scary screen.
export default function Accueil() {
  const { rows, loading } = useHome();
  const t = today();

  if (!loading && isEmpty(rows)) {
    return (
      <section className="app-screen" aria-label="Accueil">
        <div className="glass-card app-welcome">
          <span className="icon-pill icon-pill--active app-welcome__icon">
            <Sparkles size={20} aria-hidden />
          </span>
          <h2 className="app-welcome__title">Bienvenue sur Naya</h2>
          <p className="app-welcome__text">
            Ajoutez votre première vente ou un besoin du mois dans l'onglet Saisie.
            Naya vous dira ensuite, chaque jour, si vous avez assez pour vous en sortir.
          </p>
        </div>
      </section>
    );
  }

  const notifications = homeNotifications(rows);
  const balance = currentBalance(rows);
  const series = balanceSeries(rows, t);

  return (
    <section className="app-screen" aria-label="Accueil du jour">
      {/* 1. Notifications first — the user reads her situation, not a chart. */}
      <div className="app-notifications">
        {notifications.map((n: HomeNotification) => {
          const Icon = TONE_ICON[n.tone];
          return (
            <div key={n.id} className="glass-card app-notification">
              <span className={`icon-pill ${TONE_CLASS[n.tone]}`}>
                <Icon size={20} aria-hidden />
              </span>
              <p className="app-notification__text">{n.text}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Month summary card — one number and a fine curve, it summarizes. */}
      <MonthSummary balance={balance} series={series} />

      {/* 3. The day's activity as glass rows. */}
      <ActivityRows rows={rows} loading={loading} />
    </section>
  );
}

// A glass-row list of today's sales and expenses (the "liste" of §7).
function ActivityRows({
  rows,
  loading,
}: {
  rows: ReturnType<typeof useHome>["rows"];
  loading: boolean;
}) {
  const { data: allSales } = useSales();
  const { data: allExpenses } = useExpenses();
  const sales = (allSales ?? rows.sales).filter((s) => isToday(s.createdAt));
  const expenses = (allExpenses ?? rows.expenses).filter((e) => isToday(e.createdAt));

  if (loading) {
    return <p className="app-today__empty">Chargement du jour…</p>;
  }
  if (sales.length === 0 && expenses.length === 0) {
    return (
      <p className="app-today__empty">
        Aucune vente ni dépense enregistrée aujourd'hui.
      </p>
    );
  }

  return (
    <section className="app-today" aria-label="Activité du jour">
      {sales.length > 0 && <h2 className="app-today__title">Ventes du jour</h2>}
      {sales.map((s) => (
        <div key={s.id} className="glass-row app-today__row">
          <span className="icon-pill">
            <Wallet size={18} aria-hidden />
          </span>
          <span className="app-today__label">
            Vente · {METHOD_LABEL.get(s.paymentMethod)}
            {s.amountPaid < s.amountTotal ? " (partielle)" : ""}
          </span>
          <span className="app-today__amount">{formatF(s.amountPaid)}</span>
        </div>
      ))}

      {expenses.length > 0 && (
        <h2 className="app-today__title" style={{ marginTop: "var(--space-3)" }}>
          Dépenses du jour
        </h2>
      )}
      {expenses.map((e) => (
        <div key={e.id} className="glass-row app-today__row">
          <span className="icon-pill">
            <TrendingUp size={18} aria-hidden />
          </span>
          <span className="app-today__label">
            {CATEGORY_LABEL.get(e.category)} · {METHOD_LABEL.get(e.paymentMethod)}
          </span>
          <span className="app-today__amount">{formatF(e.amount)}</span>
        </div>
      ))}
    </section>
  );
}
