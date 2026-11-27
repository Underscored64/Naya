import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { supabase } from "../../lib/supabase";

// The settings sheet. On real accounts there is no "réinitialiser la démo": the
// account is real, so the sheet holds the theme toggle and sign-out. Reuses the
// existing .sheet / .settings-action styles (app.css).
export default function SettingsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
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
        aria-modal="true"
        aria-label="Paramètres"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__row">
          <span className="sheet__row-title">Paramètres</span>
        </div>

        <div className="sheet__row">
          <span className="sheet__row-title">Apparence</span>
          <button
            type="button"
            className="settings-action"
            onClick={toggle}
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? "Thème clair" : "Thème sombre"}
          </button>
        </div>

        <p className="app-settings-privacy">
          Vos données restent privées sur votre appareil et ne sont jamais vendues.
        </p>

        <button
          type="button"
          className="settings-action settings-action--danger"
          onClick={signOut}
          disabled={busy}
        >
          {busy ? "Déconnexion…" : "Se déconnecter"}
        </button>
      </section>
    </div>
  );
}
