import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <header className="landing-hero container">
      <h1 className="display landing-hero__title">
        Savoir avant lundi
        <br />
        si vous aurez assez.
      </h1>
      <p className="landing-hero__subtitle">
        Naya suit vos ventes et vos dettes, et prévoit chaque jour de la
        semaine pour vous dire à l'avance s'il vous manquera de l'argent.
      </p>
      <Link to="/app" className="btn btn-primary landing-hero__cta">
        Essayer la démo
      </Link>
    </header>
  );
}
