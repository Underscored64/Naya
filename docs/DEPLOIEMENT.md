# Déploiement (Vercel)

1. Dépôt Git (GitHub) avec le projet. Le dépôt peut rester privé ; le lien déployé, lui, doit être public.
2. Vercel : « Add New Project », importer le dépôt. Framework détecté : Vite. Build `npm run build`, sortie `dist`. `vercel.json` (déjà présent) réécrit toutes les routes hors `/api` vers `index.html`, donc `/app` ne donne pas de 404.
3. Variables d'environnement (Project Settings) : `AI_ENABLED`, `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`. Jamais dans le code.
4. Chaque `git push` redéploie. Le lien de production est celui à soumettre.
5. Les fonctions de `api/` ne tournent pas avec `npm run dev`. En local, l'appli bascule sur le repli sans IA (c'est voulu). Pour tester `api/` : `npx vercel dev`.
6. Avant la soumission : ouvrir le lien en navigation privée, sur Mac ET iPhone ; vérifier que la démo fonctionne sans IA et avec.
7. Garder le lien fonctionnel pendant toute la période d'évaluation (règlement, section 5).
