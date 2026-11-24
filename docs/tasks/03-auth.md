# Tâche 03 — Authentification Supabase
Préalable : tâche 02 faite par l'humain (schéma SQL appliqué dans Supabase, RLS activée).
Fait :
1. `src/pages/Signup.tsx`, `Login.tsx` : formulaire email + mot de passe, appel `supabase.auth.signUp` / `signInWithPassword`.
2. À l'inscription réussie, créer la ligne `profiles` correspondante (display_name demandé dans le formulaire).
3. `src/pages/AppShell.tsx` protégée : redirige vers `/login` si pas de session (`supabase.auth.getSession()` + écoute `onAuthStateChange`).
4. Bouton de déconnexion.
Fait quand : inscription puis connexion fonctionnent sur l'URL de prévisualisation Vercel ; un deuxième compte ne voit aucune donnée du premier (RLS vérifiée manuellement) ; `npm run build` passe.
