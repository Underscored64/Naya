import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section
      className="landing-section container landing-cta"
      aria-label="Essayer la démo"
    >
      <div className="card landing-cta__inner">
        <h2 className="display landing-cta__title">
          Prête à voir votre semaine ?
        </h2>
        <p className="landing-cta__text">
          Ouvrez la démo et découvrez combien il vous manquera, et quoi
          reporter si besoin.
        </p>
        <Link to="/app" className="btn btn-primary">
          Essayer la démo
        </Link>
        <p className="landing-cta__tag">Hackathon CREATE WITH AI</p>
      </div>
    </section>
  );
}
