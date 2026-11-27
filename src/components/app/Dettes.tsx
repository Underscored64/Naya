import { useMemo, useState } from "react";
import { UserPlus, HandCoins, Users } from "lucide-react";
import { useClients, useSales, useRepayments } from "../../data/queries";
import { computeClientDebt } from "../../engine/debt";
import { formatF } from "../../lib/format";
import type { Client, Sale, Repayment } from "../../data/types";
import NewClientModal from "./NewClientModal";
import RepaymentModal from "./RepaymentModal";

// "Dettes" screen: every client with the amount they still owe, computed by the
// engine's computeClientDebt (Σ(total − paid) − Σ repayments, clamped at 0).
// Each client can have a repayment recorded; a new client can be added inline.
export default function Dettes() {
  const { data: clients } = useClients();
  const { data: sales } = useSales();
  const { data: repayments } = useRepayments();

  const [addingClient, setAddingClient] = useState(false);
  const [repayFor, setRepayFor] = useState<Client | null>(null);

  // Per-client debt, straight from the engine — never a re-implementation.
  const debts = useMemo(() => {
    const list = clients ?? [];
    const s = sales ?? [];
    const r = repayments ?? [];
    return list.map((client) => ({
      client,
      debt: computeClientDebt(client.id, s as Sale[], r as Repayment[]),
    }));
  }, [clients, sales, repayments]);

  const loading = !clients;
  // Total owed across everyone, for a one-line summary at the top.
  const totalOwed = debts.reduce((sum, d) => sum + d.debt, 0);

  return (
    <section className="app-screen app-debts" aria-label="Dettes">
      <header className="app-debts__head">
        <div className="app-debts__summary">
          <span className="icon-pill icon-pill--warn">
            <Users size={18} aria-hidden />
          </span>
          <div>
            <p className="app-debts__label">Il vous est dû au total</p>
            <p className="app-debts__total">{formatF(totalOwed)}</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary app-debts__add"
          onClick={() => setAddingClient(true)}
        >
          <UserPlus size={18} aria-hidden /> Client
        </button>
      </header>

      {loading ? (
        <p className="app-today__empty">Chargement des clients…</p>
      ) : debts.length === 0 ? (
        <p className="app-today__empty">
          Aucun client pour l'instant. Ajoutez-en un pour suivre ses dettes.
        </p>
      ) : (
        <ul className="app-debts__list">
          {debts.map(({ client, debt }) => (
            <li key={client.id} className="glass-card app-debt">
              <div className="app-debt__who">
                <span className="app-debt__name">{client.name}</span>
                {client.phone && (
                  <a
                    className="app-debt__phone"
                    href={`tel:${client.phone.replace(/\s+/g, "")}`}
                  >
                    {client.phone}
                  </a>
                )}
              </div>

              <div className="app-debt__amount">
                {debt > 0 ? (
                  <span className="app-debt__figure">{formatF(debt)}</span>
                ) : (
                  <span className="app-debt__settled">À jour</span>
                )}
                <button
                  type="button"
                  className="btn app-debt__repay"
                  onClick={() => setRepayFor(client)}
                >
                  <HandCoins size={16} aria-hidden /> Rembourser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <NewClientModal
        open={addingClient}
        onClose={() => setAddingClient(false)}
        title="Nouveau client"
      />

      <RepaymentModal
        open={repayFor !== null}
        client={repayFor}
        owed={repayFor ? computeClientDebt(repayFor.id, sales ?? [], repayments ?? []) : 0}
        onClose={() => setRepayFor(null)}
      />
    </section>
  );
}
