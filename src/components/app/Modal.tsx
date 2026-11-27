import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// A small confirmation modal (a sheet, like the settings one). Used for "add a
// client" and "record a repayment". Honours prefers-reduced-motion: no entrance
// animation when the user has asked for reduced motion.
export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  if (!open) return null;

  return (
    <div
      className="app-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <motion.div
        className="glass-card app-modal"
        // No entrance animation when the user prefers reduced motion.
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-modal__head">
          <h2 className="app-modal__title">{title}</h2>
          <button
            type="button"
            className="app-iconbtn"
            aria-label="Fermer"
            onClick={onClose}
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
