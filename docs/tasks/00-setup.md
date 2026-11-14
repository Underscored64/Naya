# Task 00 — Check the scaffold and first deploy
The scaffold is already in the repo (Vite + React 18 + TS strict, react-router-dom, lucide-react, vitest, `vercel.json`, `src/` folders). Do NOT run `npm create vite`.
Do:
1. `npm install`, then `npm run build` and `npm test` (0 tests is ok, `passWithNoTests` is set).
2. `npm run dev`: the temporary page must open. Do not add libraries or rename folders.
3. `git init`, commit, push to GitHub, import in Vercel (see docs/DEPLOIEMENT.md). Vite is auto-detected.
Done when: build passes, tests run, the Vercel URL opens the page on Mac and iPhone (deep link `/app` must not 404).
