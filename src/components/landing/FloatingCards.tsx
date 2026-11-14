const CARDS = [
  {
    text: "Lundi : il vous faut 45 000 F",
    tone: "need",
    delay: "0s",
    offset: 0,
  },
  {
    text: "Esi vous doit 12 000 F vendredi",
    tone: "debt",
    delay: "0.6s",
    offset: 18,
  },
  {
    text: "Puis-je acheter ce pagne ? Oui, mais attention le 25.",
    tone: "warn",
    delay: "1.2s",
    offset: 8,
  },
] as const;

export default function FloatingCards() {
  return (
    <section className="landing-float container" aria-label="Exemples">
      {CARDS.map((c) => (
        <article
          key={c.text}
          className={`card landing-float__card landing-float__card--${c.tone}`}
          // marginBottom gives the staggered look; the CSS animation handles the
          // slow vertical bob (disabled under prefers-reduced-motion in base.css).
          style={{ animationDelay: c.delay, marginBottom: `${c.offset}px` }}
        >
          {c.text}
        </article>
      ))}
    </section>
  );
}
