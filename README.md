# Naya — projet de démarrage (hackathon CREATE WITH AI, Lomé)

App Naya en cours de construction : Vite + React + TypeScript strict, styles de base (tokens, `@font-face` OTF), landing page, et le moteur métier qui se construit tâche par tâche (`docs/tasks/`). Principe : **l'IA propose, les règles décident, l'utilisateur valide** — tous les nombres viennent du code (`src/engine/`), jamais de l'IA.

## Contenu
- `TERAX.md` : contexte lu par l'agent à chaque session (court, en anglais).
- `docs/PLAN.md` : phases, ordre, horaires, ordre de coupe.
- `docs/tasks/` : tâches courtes 00 à 13, une à la fois.
- `docs/CAHIER_DES_CHARGES.md` : spécification complète (l'agent n'en lit que la section citée).
- `docs/IA_LOCALE.md` : réglage Ollama + Terax. `docs/DEPLOIEMENT.md` : Vercel.
- `src/` : `pages/` (Landing v2, AppShell), `components/landing/`, `components/app/` (Accueil, barre d'onglets, liste des besoins, feuille de réglages), `styles/` (tokens, base, app), et le cœur du métier : `engine/` (forecast, canAfford, whatIf, suggest), `data/` (types, demo « Ama », store localStorage, provider d'état), `lib/` (dates UTC, format FCFA), `ai/fallback.ts` (messages standards, sans IA).
- `tests/` : vitest sur `engine/`, `data/`, `lib/` et `ai/fallback`.
- `public/fonts/` : y déposer les polices OTF (voir `LISEZMOI.md`).
- `public/brand/` : identité Naya — `logo-mark.png` (symbole, à utiliser dans l'UI) et `brand-sheet-reference.png` (planche de marque, référence visuelle uniquement, jamais affichée dans l'appli).
- `vercel.json` (réécriture SPA), `.env.example`, `package-lock.json`.

## Démarrage
1. Dézipper. Déposer `texgyreheros-bold.otf` dans `public/fonts/`.
2. `npm install`, puis `npm run dev` : la page de test s'affiche.
3. `git init`, premier commit, dépôt GitHub, import Vercel (`docs/DEPLOIEMENT.md`).
4. Lire `docs/IA_LOCALE.md`, ouvrir le dossier dans Terax.
5. Dire à l'agent : « Lis TERAX.md et docs/tasks/07-entry.md, propose un plan court, puis implémente. »

## Avancement (cocher au fil des commits)
- [x] 00 Socle du projet (fourni : `npm run build` et `npm test` passent)
- [ ] 00 Premier déploiement Vercel (à faire par toi)
- [x] 01 Tokens et styles de base (fournis) — [ ] police vérifiée dans DevTools
- [x] 02 Landing v2 (hero 2 colonnes, halo pêche, scroll reveal, logo) · [x] 03 Données · [x] 04 Forecast · [x] 05 Décisions
- [x] 06 Coque · [ ] 07 Saisie · [ ] 08 Prévision · [ ] 09 Puis-je ? · [ ] 10 Dettes
- [ ] 11 IA serverless · [ ] 12 Voix (bonus) · [ ] 13 Soumission
