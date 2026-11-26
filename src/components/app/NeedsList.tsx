import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useAppState, sortByDate, type NewOutflow } from "../../data/state";
import type { Recurrence } from "../../data/types";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";

const RECUR: { id: Recurrence | undefined; label: string }[] = [
  { id: undefined, label: "Une fois" },
  { id: "weekly", label: "Chaque semaine" },
  { id: "monthly", label: "Chaque mois" },
];

// The list of planned outflows ("besoins du mois"), each with add / delete.
export default function NeedsList() {
  const { state, addOutflow, removeOutflow } = useAppState();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [recurring, setRecurring] = useState<Recurrence | undefined>(undefined);

  const sorted = sortByDate(state.outflows);

  const canAdd = label.trim() !== "" && Number(amount) > 0 && date !== "";

  const submit = () => {
    if (!canAdd) return;
    const outflow: NewOutflow = {
      label: label.trim(),
      amount: Math.round(Number(amount)),
      date,
      recurring,
    };
    addOutflow(outflow);
    setLabel("");
    setAmount("");
  };

  return (
    <section className="card app-needs" aria-label="Besoins du mois">
      <h2 className="app-needs__title">Besoins du mois</h2>

      <ul className="app-needs__list">
        {sorted.map((need, i) => (
          <li
            key={need.id}
            className="glass-row app-need enter"
            style={{ "--enter-delay": `${i * 30}ms` } as React.CSSProperties}
          >
            <span className="app-need__label">{need.label ?? "Dépense"}</span>
            <span className="app-need__meta">
              {need.recurring ? <span className="app-need__recur">↻</span> : null}
              <span className="app-need__date">{need.date.slice(5).replace("-", "/")}</span>
            </span>
            <span className="app-need__amount">{formatF(need.amount)}</span>
            <button
              type="button"
              className="app-iconbtn"
              aria-label={`Supprimer ${need.label ?? "cette dépense"}`}
              onClick={() => removeOutflow(need.id)}
            >
              <Trash2 size={18} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <div className="app-need-form">
        <input
          className="app-input"
          type="text"
          placeholder="Besoin (ex. Réapprovisionnement)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="app-need-form__row">
          <input
            className="app-input app-input--amount"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Montant (F)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            className="app-input app-input--date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="app-need-form__prios" role="group" aria-label="Récurrence">
          {RECUR.map((r) => (
            <button
              key={r.label}
              type="button"
              className={`pill app-prio-pick${recurring === r.id ? " app-prio-pick--on" : ""}`}
              aria-pressed={recurring === r.id}
              onClick={() => setRecurring(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-primary app-need-form__add"
          disabled={!canAdd}
          onClick={submit}
        >
          <Plus size={18} aria-hidden /> Ajouter
        </button>
      </div>
    </section>
  );
}
