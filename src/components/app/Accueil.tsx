import { Wallet, CalendarClock, AlertTriangle } from "lucide-react";
import { useAppState, sortByDate } from "../../data/state";
import { forecast } from "../../engine/forecast";
import { primaryAlert, nextDeadlineMessage, noDeadlineMessage } from "../../ai/fallback";
import { today, monthRange } from "../../lib/dates";
import { formatF } from "../../lib/format";

export default function Accueil() {
  const { state } = useAppState();
  const { profile, needs, debts } = state;

  const t = today();
  const { end } = monthRange(t);
  const days = forecast(profile, needs, debts, t, end);
  const todayBalance = days.length > 0 ? days[0].balance : profile.openingBalance;

  const nextNeed = sortByDate(needs.filter((n) => n.dueDate >= t))[0];
  const alert = primaryAlert(state, t, end);

  return (
    <section className="app-screen" aria-label="Accueil du jour">
      <div className="card app-balance">
        <span className="app-balance__label">
          <Wallet size={16} aria-hidden /> Solde aujourd'hui
        </span>
        <span className="app-balance__value">{formatF(todayBalance)}</span>
      </div>

      <div className="card app-deadline">
        <span className="app-deadline__label">
          <CalendarClock size={16} aria-hidden /> Prochaine échéance
        </span>
        <p>{nextNeed ? nextDeadlineMessage(nextNeed) : noDeadlineMessage()}</p>
      </div>

      <div className="card app-alert">
        <span className="app-alert__label">
          <AlertTriangle size={16} aria-hidden /> Naya vous dit
        </span>
        <p>{alert}</p>
      </div>
    </section>
  );
}
