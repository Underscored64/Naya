import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import "./landing.css";

export default function Navbar() {
  return (
    <nav className="landing-nav" aria-label="Navigation principale">
      <div className="landing-nav__inner">
        <span className="landing-nav__brand">
          <Sparkles size={18} aria-hidden /> Naya
        </span>
        <Link to="/app" className="btn btn-primary landing-nav__cta">
          Essayer la démo
        </Link>
      </div>
    </nav>
  );
}
