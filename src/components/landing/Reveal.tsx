import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper: the child starts slightly lowered + translucent,
 * then floats up when it enters the viewport — once only. Uses a single
 * IntersectionObserver, no animation library.
 *
 * The "hidden" initial state is defined under @media (prefers-reduced-motion:
 * no-preference) in landing.css, so under reduced motion the content is always
 * rendered in place and this hook does nothing visible.
 */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`landing-reveal${shown ? " is-visible" : ""}`}>
      {children}
    </div>
  );
}
