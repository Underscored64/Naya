import { useState } from "react";
import { HandCoins } from "lucide-react";
import Modal from "./Modal";
import { useCreateRepayment } from "../../data/queries";
import type { Client } from "../../data/types";
import { formatF } from "../../lib/format";

// "Enregistrer un remboursement" for one client. A whole-amount of FCFA, always
// > 0 (the engine clamps an overpaid client to 0, so a larger number is allowed
// but never increases a negative debt). `owed` is shown as a gentle hint.
export default function RepaymentModal({
  open,
  client,
  owed,
  onClose,
}: {
  open: boolean;
  client: Client | null;
  owed: number;
  onClose: () => void;
}) {
  const createRepayment = useCreateRepayment();
  const [amount, setAmount] = useState("");

  const amountNum = parseInt(amount, 10);
  const valid = Number.isInteger(amountNum) && amountNum > 0;

  const close = () => {
    if (createRepayment.isPending) return;
    setAmount("");
    onClose();
  };

  const submit = () => {
    if (!client || !valid || createRepayment.isPending) return;
    createRepayment.mutate(
      { clientId: client.id, amount: amountNum },
      {
        onSuccess: () => {
          setAmount("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      title={client ? `Remboursement de ${client.name}` : "Remboursement"}
      onClose={close}
    >
      <div className="app-modal__body">
        <p className="app-modal__hint">
          {owed > 0
            ? `Encore dû : ${formatF(owed)}`
            : "Ce client ne vous doit plus rien. Vous pouvez noter un reçu."}
        </p>

        <label className="app-field">
          <span className="app-field__label">Montant reçu</span>
          <input
            className="app-input app-input--amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="0 F"
            value={amount}
            autoFocus
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!valid || createRepayment.isPending}
          onClick={submit}
        >
          <HandCoins size={18} aria-hidden />
          {createRepayment.isPending
            ? "Enregistrement…"
            : "Enregistrer le remboursement"}
        </button>
      </div>
    </Modal>
  );
}
