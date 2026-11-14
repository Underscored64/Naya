const CARDS = [
  { text: "Lundi : il vous faut 45 000 F", tone: "need" },
  { text: "Esi vous doit 12 000 F vendredi", tone: "debt" },
  { text: "Puis-je acheter ce pagne ? Oui, mais attention le 25.", tone: "warn" },
] as const;

/**
 * The three hero cards. The diagonal stagger, peach halo, continuous bob and the
 * short staggered entrance are all driven by CSS (landing.css) off each card's
 * position (:nth-child) and tone class -- no inline motion is set here.
 */
export default function FloatingCards() {
  return (
    <div className="landing-float" aria-label="Exemples de ce que Naya prévoit">
      {CARDS.map((c) => (
        <article
          key={c.text}
          className={`card landing-float__card landing-float__card--${c.tone}`}
        >
          {c.text}
        </article>
      ))}
    </div>
  );
}
