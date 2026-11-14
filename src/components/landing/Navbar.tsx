import { Link } from "react-router-dom";
import "./landing.css";

export default function Navbar() {
  return (
    <nav className="landing-nav" aria-label="Navigation principale">
      <div className="landing-nav__inner">
        <Link to="/" className="landing-nav__brand" aria-label="Naya — accueil">
          <img
            className="landing-nav__mark"
            src="/brand/logo-mark.png"
            alt="Symbole Naya"
            width={30}
            height={30}
          />
          <span className="display landing-nav__word">Naya</span>
        </Link>
        <Link to="/app" className="btn btn-primary landing-nav__cta">
          Essayer la démo
        </Link>
      </div>
    </nav>
  );
}
