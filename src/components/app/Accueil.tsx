import { AlertTriangle, Info, CheckCircle, Sparkles } from "lucide-react";
import { useAppState } from "../../data/state";
import { today } from "../../lib/dates";
import { homeNotifications, type NotificationTone } from "../../ai/fallback";
import MonthSummary from "./MonthSummary";

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

// A freshly created account: no sales, no debts, no planned entries yet.
function isNewAccount(state: ReturnType<typeof useAppState>["state"]): boolean {
  const { sales, clients, inflows, outflows } = state;
  return sales.length === 0 && clients.length === 0 && inflows.length === 0 && outflows.length === 0;
}

export default function Accueil() {
  const { state } = useAppState();
  const t = today();

  // Warm welcome when there is nothing to show yet — not an empty, scary list.
  if (isNewAccount(state)) {
    return (
      <section className="app-screen" aria-label="Accueil">
        <div className="glass-card app-welcome enter" style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
          <span className={`icon-pill icon-pill--active app-welcome__icon`}>
            <Sparkles size={20} aria-hidden />
          </span>
          <h2 className="app-welcome__title">Bienvenue sur Naya</h2>
          <p className="app-welcome__text">
            Ajoutez votre première vente ou un besoin du mois. Naya vous dira ensuite,
            chaque jour, si vous avez assez pour vous en sortir.
          </p>
        </div>
      </section>
    );
  }

  // 1 to 3 concrete notifications, generated from the real account state.
  const notifications = homeNotifications(state, t, monthEnd(t));

  return (
    <section className="app-screen" aria-label="Accueil du jour">
      {/* 1. Notifications first — the user reads her situation, not a chart. */}
      <div className="app-notifications">
        {notifications.map((n, i) => {
          const Icon = TONE_ICON[n.tone];
          return (
            <div
              key={n.id}
              className="glass-card app-notification enter"
              style={{ "--enter-delay": `${i * 40}ms` } as React.CSSProperties}
            >
              <span className={`icon-pill ${TONE_CLASS[n.tone]}`}>
                <Icon size={20} aria-hidden />
              </span>
              <p className="app-notification__text">{n.text}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Month summary card — it summarizes, it does not open the screen. */}
      <MonthSummary state={state} />
    </section>
  );
}

// Last day of the month containing `date`, as "YYYY-MM-DD".
function monthEnd(date: string): string {
  const [y, m] = date.split("-").map((n) => parseInt(n, 10));
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${date.slice(0, 6)}-${String(lastDay).padStart(2, "0")}`;
}
