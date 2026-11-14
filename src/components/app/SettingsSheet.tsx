import { X, RotateCcw } from "lucide-react";

// A small slide-up sheet with the "Réinitialiser la démo" action.
export default function SettingsSheet({
  open,
  onClose,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
}) {
  if (!open) return null;

  const onConfirm = () => {
    onReset();
    onClose();
  };

  return (
    <div className="app-sheet" role="dialog" aria-modal="true" aria-label="Réglages">
      <button
        type="button"
        className="app-sheet__backdrop"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div className="app-sheet__panel">
        <div className="app-sheet__head">
          <h2>Réglages</h2>
          <button type="button" className="app-iconbtn" aria-label="Fermer" onClick={onClose}>
            <X size={20} aria-hidden />
          </button>
        </div>
        <p>Recommencer avec la démo d'Ama efface vos données locales.</p>
        <button type="button" className="btn btn-primary app-sheet__reset" onClick={onConfirm}>
          <RotateCcw size={18} aria-hidden /> Réinitialiser la démo
        </button>
      </div>
    </div>
  );
}
