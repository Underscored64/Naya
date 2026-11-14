import { Mic, CalendarClock, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: Mic,
    title: "Dictez",
    text: "Vous dites ou écrivez vos ventes, vos dettes et vos besoins du mois.",
  },
  {
    icon: CalendarClock,
    title: "Naya prévoit",
    text: "Des règles de calcul ajoutent entrées et sorties pour chaque jour.",
  },
  {
    icon: CheckCircle2,
    title: "Vous décidez",
    text: "Naya vous dit si ça tient ; vous gardez le dernier mot.",
  },
];

export default function HowItWorks() {
  return (
    <section className="landing-section container" aria-label="Comment ça marche">
      <h2 className="display landing-section__title">Comment ça marche</h2>
      <div className="landing-steps">
        {STEPS.map((s) => (
          <article key={s.title} className="card landing-step">
            <s.icon size={28} className="landing-step__icon" aria-hidden />
            <h3 className="landing-step__title">{s.title}</h3>
            <p className="landing-step__text">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
