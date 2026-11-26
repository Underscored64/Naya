import { forecast, type DayForecast } from "../../engine/forecast";
import { computeBalance } from "../../engine/balance";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";
import type { AppState } from "../../data/types";

// A 7-point sparkline of the daily balance across the window.
function Sparkline({ days }: { days: DayForecast[] }) {
  if (days.length === 0) return null;
  const balances = days.map((d) => d.balance);
  const min = Math.min(...balances);
  const max = Math.max(...balances);
  const span = max - min || 1;
  const w = 100;
  const h = 28;
  const points = days
    .map((d, i) => {
      const x = (i / Math.max(days.length - 1, 1)) * w;
      const y = h - ((d.balance - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

// The month summary card. It summarizes the situation with one number and a
// mini graph — it does not open the full forecast. Numbers come from the engine.
export default function MonthSummary({ state }: { state: AppState }) {
  const t = today();
  const [y, m] = t.split("-").map((n) => parseInt(n, 10));
  const end = `${t.slice(0, 6)}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, "0")}`;

  const days = forecast(state, state.inflows, state.outflows, t, end);
  const todayBalance = computeBalance(
    state.initialBalance,
    state.sales,
    state.expenses,
    state.repayments,
  );
  const endBalance = days.length > 0 ? days[days.length - 1].balance : todayBalance;
  const positive = endBalance >= 0;

  return (
    <section className="glass-card app-summary" aria-label="Résumé du mois">
      <div className="app-summary__row">
        <span className="app-summary__label">Solde du mois</span>
        <span className={`app-summary__value ${positive ? "is-positive" : "is-negative"}`}>
          {formatF(endBalance)}
        </span>
      </div>

      <p className="app-summary__hint">
        Aujourd'hui : {formatF(todayBalance)}
      </p>

      <div className={`app-summary__chart ${positive ? "is-positive" : "is-negative"}`}>
        <Sparkline days={days} />
      </div>
    </section>
  );
}
