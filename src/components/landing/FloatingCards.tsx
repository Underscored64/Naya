import { useEffect, useRef, useState } from "react";

const CARDS = [
  { text: "Lundi : il vous faut 45 000 F", tone: "need" },
  { text: "Esi vous doit 12 000 F vendredi", tone: "debt" },
  { text: "Puis-je acheter ce pagne ? Oui, mais attention le 25.", tone: "warn" },
] as const;

const INTERVAL = 2800; // ms between cards

/**
 * Hero cards shown as a vertical auto-scroll carousel: one card visible at a
 * time in a fixed-height slot, cross-fading with a slight vertical slide,
 * advancing on a timer and looping.
 *
 * Motion (the setInterval timer + the CSS fade/slide) is fully disabled under
 * prefers-reduced-motion: the hook bails out early and the stylesheet then
 * stacks all three cards statically.
 */
export default function FloatingCards() {
  const [index, setIndex] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    // Static fallback: no timer, no auto-advance under reduced motion.
    if (prefersReduced.current) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CARDS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Reduced motion: render every card, stacked and static.
  if (prefersReduced.current) {
    return (
      <div
        className="landing-float landing-float--static"
        aria-label="Exemples de ce que Naya prévoit"
      >
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

  return (
    <div
      className="landing-float"
      aria-label="Exemples de ce que Naya prévoit"
      aria-live="polite"
    >
      {CARDS.map((c, i) => (
        <article
          key={c.text}
          aria-hidden={i !== index}
          className={`card landing-float__card landing-float__card--${c.tone}${
            i === index ? " is-active" : ""
          }`}
        >
          {c.text}
        </article>
      ))}
    </div>
  );
}
