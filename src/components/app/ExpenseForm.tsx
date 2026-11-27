import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateExpense, type NewExpenseInput } from "../../data/queries";
import type { PaymentMethod, ExpenseCategory } from "../../data/types";
import { PAYMENT_METHODS, EXPENSE_CATEGORIES } from "./paymentLabels";

// "Nouvelle dépense". A single integer amount, a category, a payment method and
// an optional note. The amount is a whole number of FCFA, never a float.
export default function ExpenseForm() {
  const createExpense = useCreateExpense();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("stock");
  const [method, setMethod] = useState<PaymentMethod>("especes");
  const [note, setNote] = useState("");

  const amountNum = parseInt(amount, 10);
  const valid = Number.isInteger(amountNum) && amountNum > 0;

  const submit = () => {
    if (!valid || createExpense.isPending) return;
    const input: NewExpenseInput = {
      amount: amountNum,
      category,
      paymentMethod: method,
      note: note.trim() || null,
    };
    createExpense.mutate(input, {
      onSuccess: () => {
        setAmount("");
        setCategory("stock");
        setMethod("especes");
        setNote("");
      },
    });
  };

  return (
    <section className="glass-card app-entry" aria-label="Nouvelle dépense">
      <h2 className="app-entry__title">Nouvelle dépense</h2>

      <label className="app-field">
        <span className="app-field__label">Montant</span>
        <input
          className="app-input app-input--amount"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="0 F"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <div className="app-entry__row">
        <label className="app-field">
          <span className="app-field__label">Catégorie</span>
          <select
            className="app-input"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="app-field">
          <span className="app-field__label">Paiement</span>
          <select
            className="app-input"
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="app-field">
        <span className="app-field__label">Note (facultatif)</span>
        <input
          className="app-input"
          type="text"
          placeholder="ex. Carburage moto"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <button
        type="button"
        className="btn btn-primary app-entry__submit"
        disabled={!valid || createExpense.isPending}
        onClick={submit}
      >
        <Plus size={18} aria-hidden /> Enregistrer la dépense
      </button>
    </section>
  );
}
