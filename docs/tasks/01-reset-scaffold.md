# Tâche 01 — Nouveau scaffold (remplace le code, garde le dépôt et Vercel)
Préalable : tâche 00 validée par l'humain.
Fait :
1. Dans le dépôt existant, créer le nouveau projet dans un dossier temporaire (`npx create-vite@latest tmp-app -- --template react-ts`), fusionner à la racine sans écraser `vercel.json`, `.env.example`, `.git`, `README.md` s'ils existent déjà et doivent être gardés (sinon les recréer proprement).
2. Installer : `npm i @supabase/supabase-js @tanstack/react-query motion lucide-react react-router-dom` et dev : `npm i -D vitest typescript`.
3. `.env.example` : `VITE_SUPABASE_URL=`, `VITE_SUPABASE_ANON_KEY=` (jamais la clé service role ici).
4. `src/lib/supabase.ts` : client Supabase unique, utilisant ces deux variables.
5. Copier `TERAX.md` et le dossier `docs/` (déjà fournis) à la racine du dépôt.
Fait quand : `npm run build` passe ; `git status` ne montre aucune suppression de `vercel.json` ; aucun secret dans le code commité.
