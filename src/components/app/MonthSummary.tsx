import { Wallet } from "lucide-react";
import type { CSSProperties } from "react";
import { forecast, type DayForecast } from "../../engine/forecast";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";
import type { Profile, Need, Debt } from "../../data/types";

// A thin, no-axis 30-day balance line. Pure SVG, no chart library. The line
// dips into --warn below zero so a red zone is readable without a dashboard.
export function Sparkline({ days }: { days: DayForecast[] }) {
  if (days.length === 0) return null;
  const w = 300;
  const h = 64;
  const values = days.map((d) => d.balance);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;

  const x = (i: number) => (i / (days.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / span) * h;

  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const zeroY = y(0);

  return (
    <svg
      className="app-spark"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Évolution prévue du solde ce mois"
    >
      <line className="app-spark__zero" x1="0" x2={w} y1={zeroY} y2={zeroY} />
      <path className="app-spark__line" d={line} fill="none" />
    </svg>
  );
}

// Month summary: big today balance (.display) + the fine 30-day curve.
export default function MonthSummary({
  profile,
  needs,
  debts,
}: {
  profile: Profile;
  needs: Need[];
  debts: Debt[];
}) {
  const t = today();
  const end = monthEnd(t);
  const days = forecast(profile, needs, debts, t, end);
  const todayBalance = days.length > 0 ? days[0].balance : profile.openingBalance;

  return (
    <div className="glass-card app-summary enter" style={{ "--enter-delay": "120ms" } as CSSProperties}>
      <span className="app-summary__label">
        <Wallet size={16} aria-hidden /> Solde prévu aujourd'hui
      </span>
      <span className="app-summary__value display">{formatF(todayBalance)}</span>
      <Sparkline days={days} />
    </div>
  );
}

function monthEnd(date: string): string {
  const [y, m] = date.split("-").map((n) => parseInt(n, 10));
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${date.slice(0, 6)}-${String(lastDay).padStart(2, "0")}`;
}
