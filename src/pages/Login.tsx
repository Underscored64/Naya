import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import "../components/auth/auth.css";

// Log in with email + password. On success, jump straight to the app.
export default function Login() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <motion.div
        className="auth__card glass-card"
        role="dialog"
        aria-label="Se connecter"
        // No entrance animation when the user prefers reduced motion.
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="auth__brand">
          <span className="auth__mark" aria-hidden>
            <Sparkles size={22} strokeWidth={1.75} />
          </span>
          <span className="display auth__title">Naya</span>
        </span>

        <p className="auth__text">
          Bon retour. Connectez-vous pour retrouver votre compte.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-field__label">Adresse e-mail</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Mot de passe</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="auth-msg auth-msg--error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={busy}
          >
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="auth-alt">
          Pas encore de compte ?{" "}
          <Link to="/signup">Créer un compte</Link>
        </p>
        <Link to="/" className="auth-back">
          ← Retour
        </Link>
      </motion.div>
    </main>
  );
}
