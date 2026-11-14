import { ShieldCheck, Calculator, MessageSquareText } from "lucide-react";

const POINTS = [
  {
    icon: Calculator,
    title: "Des chiffres calculés",
    text: "Chaque montant vient de règles claires, pas d'une estimation.",
  },
  {
    icon: MessageSquareText,
    title: "L'IA explique seulement",
    text: "Elle reformule en français simple, elle n'invente aucun chiffre.",
  },
  {
    icon: ShieldCheck,
    title: "Données fictives",
    text: "La démo utilise la commerçante « Ama », aucune donnée réelle.",
  },
];

export default function WhySafe() {
  return (
    <section className="landing-section container" aria-label="Pourquoi c'est sûr">
      <h2 className="display landing-section__title">Pourquoi c'est sûr</h2>
      <div className="landing-steps">
        {POINTS.map((p) => (
          <article key={p.title} className="card landing-step">
            <p.icon size={28} className="landing-step__icon" aria-hidden />
            <h3 className="landing-step__title">{p.title}</h3>
            <p className="landing-step__text">{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
