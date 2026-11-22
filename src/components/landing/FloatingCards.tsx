import { formatF } from "../../lib/format";

/**
 * Hero floating visual: 2-3 glass cards stacked in depth on desktop (a
 * notification card, a debts card, and a forecast card with a big number + a
 * simple SVG sparkline). On mobile a single forecast card shows below the text.
 * The front card carries the continuous `float` animation (disabled under
 * prefers-reduced-motion via base.css). No chart library — the curve is a plain
 * SVG polyline.
 */
export default function FloatingCards() {
  return (
    <div
      className="landing-float"
      aria-label="Aperçu de ce que Naya prévoit"
    >
      {/* Back card: a day notification. */}
      <article
        className="glass-card landing-float__card landing-float__card--back"
        aria-hidden
      >
        <p className="landing-float__label">Lundi</p>
        <p className="landing-float__big">{formatF(45000)}</p>
        <p className="landing-float__hint">il vous faut pour vos besoins</p>
      </article>

      {/* Middle card: a small debt. */}
      <article
        className="glass-card landing-float__card landing-float__card--mid"
        aria-hidden
      >
        <p className="landing-float__label">Dette</p>
        <p className="landing-float__big landing-float__big--ok">
          {formatF(12000)}
        </p>
        <p className="landing-float__hint">Esi vous doit vendredi</p>
      </article>

      {/* Front card: forecast — the animated one, and the only one on mobile. */}
      <article className="glass-card landing-float__card landing-float__card--front float">
        <p className="landing-float__label">Solde prévu · lundi</p>
        <p className="display landing-float__figure">{formatF(38000)}</p>
        <svg
          className="landing-float__curve"
          viewBox="0 0 120 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points="2,30 22,24 42,26 62,14 82,18 102,8 118,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="landing-float__hint landing-float__hint--warn">
          Il vous manque {formatF(7000)}
        </p>
      </article>
    </div>
  );
}
