import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import Modal from "./Modal";
import { useCreateClient, useCreateSale } from "../../data/queries";
import type { Client } from "../../data/types";

// A tiny "add a client" form (name is enough; phone optional). Reused by the
// Dettes screen and by the "Nouvelle vente" form when the client is not in the
// list yet. `onCreated` reports the saved client so a caller can use its id.
//
// "Montant dû" is an optional opening debt. There is no dedicated debt field in
// the data model — a debt is just a credit sale (total − paid). So when an
// amount is given we record a credit sale for the new client (paid 0); the
// engine then reports it as owed. Left empty (e.g. from the sale form) only
// creates the client.
export default function NewClientModal({
  open,
  onClose,
  onCreated,
  title = "Nouveau client",
  // Show the "Montant dû" field. Used on the Dettes screen to open a client with
  // a starting debt; hidden from the "Nouvelle vente" flow, where the sale amount
  // is itself the debt (name is enough there).
  showOwed = true,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (client: Client) => void;
  title?: string;
  showOwed?: boolean;
}) {
  const createClient = useCreateClient();
  const createSale = useCreateSale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [owed, setOwed] = useState(""); // "" means "no opening debt"

  const owedNum = parseInt(owed, 10);
  const hasOwed = Number.isInteger(owedNum) && owedNum > 0;

  const valid = name.trim().length > 0;
  const saving = createClient.isPending || createSale.isPending;

  const reset = () => {
    setName("");
    setPhone("");
    setOwed("");
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const finish = (client: Client) => {
    reset();
    onCreated?.(client);
    onClose();
  };

  const submit = () => {
    if (!valid || saving) return;

    createClient.mutate(
      { name: name.trim(), phone: phone.trim() || null },
      {
        onSuccess: (client) => {
          // An opening debt is recorded as a credit sale (paid 0) so the engine
          // reports it as owed. No amount → just the client.
          if (hasOwed) {
            createSale.mutate(
              {
                amountTotal: owedNum,
                amountPaid: 0,
                paymentMethod: "especes",
                clientId: client.id,
                note: "Dette initiale",
              },
              {
                onSuccess: () => finish(client),
                onError: () => finish(client), // client exists; surface later
              },
            );
          } else {
            finish(client);
          }
        },
      },
    );
  };

  return (
    <Modal open={open} title={title} onClose={close}>
      <div className="app-modal__body">
        <label className="app-field">
          <span className="app-field__label">Nom du client</span>
          <input
            className="app-input"
            type="text"
            placeholder="ex. Awa"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="app-field">
          <span className="app-field__label">Téléphone (facultatif)</span>
          <input
            className="app-input"
            type="tel"
            placeholder="ex. +228 90 00 00 01"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {showOwed && (
          <label className="app-field">
            <span className="app-field__label">Montant dû (facultatif)</span>
            <input
              className="app-input app-input--amount"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="0 F"
              value={owed}
              onChange={(e) => setOwed(e.target.value)}
            />
          </label>
        )}

        <button
          type="button"
          className="btn btn-primary"
          disabled={!valid || saving}
          onClick={submit}
        >
          {saving ? (
            <>
              <UserPlus size={18} aria-hidden /> Enregistrement…
            </>
          ) : (
            <>
              <Plus size={18} aria-hidden /> Enregistrer le client
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
