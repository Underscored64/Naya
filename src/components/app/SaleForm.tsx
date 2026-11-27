import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useClients, useCreateSale, type NewSaleInput } from "../../data/queries";
import type { PaymentMethod } from "../../data/types";
import { PAYMENT_METHODS } from "./paymentLabels";
import NewClientModal from "./NewClientModal";

// "Nouvelle vente". amount_paid defaults to amount_total; the user lowers it to
// record a partial sale (the remainder becomes a client debt automatically).
// A client missing from the list can be added inline via a small modal.
export default function SaleForm() {
  const { data: clients, isLoading } = useClients();
  const createSale = useCreateSale();
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState(""); // "" means "follow the total"
  const [method, setMethod] = useState<PaymentMethod>("especes");
  const [clientId, setClientId] = useState("");
  const [note, setNote] = useState("");
  const [addingClient, setAddingClient] = useState(false);

  // Integers only: NaN or a non-integer amount is rejected at submit time.
  const totalNum = parseInt(total, 10);
  const paidNum = paid.trim() === "" ? totalNum : parseInt(paid, 10);

  const valid =
    Number.isInteger(totalNum) && totalNum > 0 &&
    Number.isInteger(paidNum) && paidNum >= 0 && paidNum <= totalNum;

  const submit = () => {
    if (!valid || createSale.isPending) return;
    const input: NewSaleInput = {
      amountTotal: totalNum,
      amountPaid: paidNum,
      paymentMethod: method,
      clientId: clientId || null,
      note: note.trim() || null,
    };
    createSale.mutate(input, {
      onSuccess: () => {
        setTotal("");
        setPaid("");
        setMethod("especes");
        setClientId("");
        setNote("");
      },
    });
  };

  return (
    <section className="glass-card app-entry" aria-label="Nouvelle vente">
      <h2 className="app-entry__title">Nouvelle vente</h2>

      <label className="app-field">
        <span className="app-field__label">Montant total</span>
        <input
          className="app-input app-input--amount"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="0 F"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
      </label>

      <label className="app-field">
        <span className="app-field__label">Montant encaissé</span>
        <input
          className="app-input app-input--amount"
          type="number"
          inputMode="numeric"
          min={0}
          max={totalNum || undefined}
          step={1}
          placeholder={total ? `${totalNum} F` : "0 F"}
          value={paid}
          onChange={(e) => setPaid(e.target.value)}
        />
      </label>

      {Number.isInteger(paidNum) && paidNum < totalNum && (
        <p className="app-entry__hint">Le client restera débiteur de {totalNum - paidNum} F.</p>
      )}

      <div className="app-entry__row">
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

        <label className="app-field">
          <span className="app-field__label">Client (facultatif)</span>
          <select
            className="app-input"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={isLoading && clients === undefined}
          >
            <option value="">— Aucun —</option>
            {(clients ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="app-entry__newclient"
            onClick={() => setAddingClient(true)}
          >
            <UserPlus size={14} aria-hidden /> Nouveau client
          </button>
        </label>
      </div>

      <label className="app-field">
        <span className="app-field__label">Note (facultatif)</span>
        <input
          className="app-input"
          type="text"
          placeholder="ex. Marché de midi"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      <button
        type="button"
        className="btn btn-primary app-entry__submit"
        disabled={!valid || createSale.isPending}
        onClick={submit}
      >
        <Plus size={18} aria-hidden /> Enregistrer la vente
      </button>

      <NewClientModal
        open={addingClient}
        onClose={() => setAddingClient(false)}
        onCreated={(client) => setClientId(client.id)}
      />
    </section>
  );
}
