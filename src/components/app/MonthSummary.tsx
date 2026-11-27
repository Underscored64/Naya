import { formatF } from "../../lib/format";

// A fine balance line across the current month (no axes). Reuses the existing
// .app-spark / .app-spark__line styles (app.css).
function Sparkline({ series }: { series: number[] }) {
  if (series.length < 2) return null;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const w = 100;
  const h = 64;
  const points = series
    .map((b, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((b - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className="app-spark"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <polyline
        className="app-spark__line"
        points={points}
        fill="none"
      />
    </svg>
  );
}

// The month summary card. It summarizes the situation with one number and a fine
// curve — it does not open the full forecast (docs/DESIGN.md §7). The numbers
// come from the engine, passed in, never re-derived here.
export default function MonthSummary({
  balance,
  series,
}: {
  balance: number;
  series: number[];
}) {
  return (
    <section className="glass-card app-summary" aria-label="Résumé du mois">
      <span className="app-summary__label">Solde du mois</span>
      <span className="app-summary__value">{formatF(balance)}</span>
      <Sparkline series={series} />
    </section>
  );
}
