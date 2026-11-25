import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Settings panel: sign out + reset the demo (tâche 01 demo data only, until the
// real data layer lands).
export default function SettingsSheet({
  open,
  onClose,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setBusy(false);
      onClose();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className={`sheet-overlay${open ? " is-open" : ""}`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <section
        className="glass-card sheet"
        role="dialog"
        aria-label="Réglages"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__row">
          <span className="sheet__row-title">Réglages</span>
          <button
            type="button"
            className="app-iconbtn"
            onClick={onClose}
            aria-label="Fermer les réglages"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          className="settings-action settings-action--danger"
          onClick={signOut}
          disabled={busy}
        >
          {busy ? "Déconnexion…" : "Se déconnecter"}
        </button>

        <button
          type="button"
          className="settings-action"
          onClick={() => {
            onReset();
            onClose();
          }}
        >
          Réinitialiser la démo
        </button>
      </section>
    </div>
  );
}
