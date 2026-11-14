import { Link } from "react-router-dom";
import FloatingCards from "./FloatingCards";

export default function Hero() {
  return (
    <header className="landing-hero container">
      <div className="landing-hero__text">
        <h1 className="display landing-hero__title">Savoir avant lundi.</h1>
        <p className="landing-hero__accent">Décider en toute sérénité.</p>
        <p className="landing-hero__subtitle">
          Votre argent, vos échéances et vos prochaines dépenses, enfin sous
          contrôle.
        </p>
        <Link to="/app" className="btn btn-primary landing-hero__cta">
          Essayer la démo
        </Link>
      </div>
      <FloatingCards />
    </header>
  );
}
