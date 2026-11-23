import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useAppState, sortByDate, type NewNeed } from "../../data/state";
import type { Priority } from "../../data/types";
import { today } from "../../lib/dates";
import { formatF } from "../../lib/format";

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: "indispensable", label: "Indispensable" },
  { id: "important", label: "Important" },
  { id: "confort", label: "Confort" },
];

// Priority chip shown on each need, coloured by its level.
function PriorityTag({ priority }: { priority: Priority }) {
  const label = PRIORITIES.find((p) => p.id === priority)?.label ?? priority;
  return <span className={`app-need__prio app-need__prio--${priority}`}>{label}</span>;
}

export default function NeedsList() {
  const { state, addNeed, deleteNeed } = useAppState();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(today());
  const [priority, setPriority] = useState<Priority>("important");

  const sorted = sortByDate(state.needs);

  const canAdd = label.trim() !== "" && Number(amount) > 0 && dueDate !== "";

  const submit = () => {
    if (!canAdd) return;
    const need: NewNeed = {
      label: label.trim(),
      amount: Number(amount),
      dueDate,
      priority,
    };
    addNeed(need);
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
            <span className="app-need__label">{need.label}</span>
            <span className="app-need__meta">
              <PriorityTag priority={need.priority} />
            </span>
            <span className="app-need__amount">{formatF(need.amount)}</span>
            <button
              type="button"
              className="app-iconbtn"
              aria-label={`Supprimer ${need.label}`}
              onClick={() => deleteNeed(need.id)}
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="app-need-form__prios" role="group" aria-label="Priorité">
          {PRIORITIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pill app-prio-pick${priority === p.id ? " app-prio-pick--on" : ""}`}
              aria-pressed={priority === p.id}
              onClick={() => setPriority(p.id)}
            >
              {p.label}
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
