import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { upsertProfile } from "../data/queries";
import "../components/auth/auth.css";

// Sign-up: email + password + a display name. The display name is stored both in
// the user's auth metadata (audit) and, on auto-login, written directly into the
// user's own `profiles` row — a self-insert the RLS allows, more reliable than
// depending on the Postgres trigger alone.
export default function Signup() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: name.trim() } },
      });
      if (error) throw error;

      // Email confirmation off (typical for a demo): sign up auto-logs in and
      // we can write the user's own profile row right away.
      if (data.session?.user?.id) {
        await upsertProfile(data.session.user.id, name.trim());
        navigate("/app", { replace: true });
        return;
      }
      // Otherwise a confirmation email is pending — send the user to /login.
      navigate("/login");
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
        aria-label="Créer un compte"
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
          Créez votre compte pour suivre vos ventes, vos dettes et savoir
          ce que vous pouvez vous permettre ce mois-ci.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="auth-field">
            <span className="auth-field__label">Votre nom</span>
            <input
              className="auth-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ama"
              autoComplete="name"
              required
              minLength={2}
            />
          </label>

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
              autoComplete="new-password"
              required
              minLength={6}
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
            {busy ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-alt">
          Déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
        <Link to="/" className="auth-back">
          ← Retour
        </Link>
      </motion.div>
    </main>
  );
}
