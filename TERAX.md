# TERAX.md — Contexte du projet (à lire en premier, à chaque session)

## What we are building
**Naya**: a French-language web app for small female merchants in Lomé. It tracks sales and customer debts, knows the month's needs, forecasts day by day, and answers "Can I afford this this month?".
Principle: **AI proposes, rules decide, the user validates.** All numbers come from code (`src/engine/`). The LLM never computes or invents an amount. The app must work with the LLM off.
Deadline: Sat Nov 14, 2026. Dev 10:00-12:30 and 13:00-14:45. Submission (working deployed URL) at 15:30. Prefer simple and working over clever.

## Stack (do not change without asking)
- Vite + React 18 + TypeScript **strict**. Plain CSS with variables (`src/styles/tokens.css`). No Tailwind, no UI kit.
- State: React state + `localStorage` (try/catch around every access). No database, no auth.
- Tests: `vitest` (engine only).
- Deploy: Vercel. Serverless functions in `api/` (OpenAI-compatible HTTP call via `fetch`, no SDK).
- Icons: `lucide-react` (only extra dependency allowed besides react-router-dom and vitest).
- UI text in **French** (vouvoiement, warm and simple). Code, identifiers and comments in **English**.

## Hard rules
1. Money = integer FCFA. Never floats. Format: `45 000 F` via `formatF()` in `src/lib/format.ts`.
2. Dates = `YYYY-MM-DD` strings. Never rely on the machine's timezone for logic.
3. `src/engine/` = pure functions, zero imports from React, the DOM or `ai/`. Every function has a vitest test.
4. LLM calls only from `api/*.ts` (Web-standard handlers, no `@vercel/node`, see task 11). No key in the browser. Output = JSON validated by hand (no Zod): invalid -> fallback.
5. Every AI feature has a non-AI fallback in `src/ai/fallback.ts`. Text from the AI may only contain numbers present in the input (check in code).
6. Demo data is fictional (merchant "Ama"). Dates are generated relative to today. Never real data.
7. Do not add libraries, rename folders or change the stack on your own. If unclear, stop and ask.
8. Fonts: `TeX Gyre Heros Bold` for big titles (class `.display`), self-hosted **OTF** `public/fonts/texgyreheros-bold.otf`, declared in `src/styles/base.css`. Body uses the system font. Fallback `Helvetica, Arial, sans-serif`.
9. Style "Floating UI": floating cards, soft two-layer shadows, 20px radius, silver hairline border, blurred pill navbar. Palette in `tokens.css` (accent `#e0afa0`).
10. Respect `prefers-reduced-motion`. Touch targets >= 44px. No horizontal scroll on mobile.

## How to work
- **One task at a time** from `docs/tasks/NN-*.md`. Read only that file + this one (+ `docs/CAHIER_DES_CHARGES.md` section named in the task, never the whole file).
- Short plan first, then implement, then run the checks of the task.
- Done = the "Done when" list passes. Then `git add -A && git commit -m "task NN: ..."` and `git push` (Vercel redeploys).
- Do not start the next task before the commit.
- Keep files small (< 150 lines). Prefer many small modules.

## Status
Scaffold done (tasks 00-01 provided). Brand ready: `public/brand/logo-mark.png` (symbol, use it) and `public/brand/brand-sheet-reference.png` (reference sheet only, never render it in the UI). Start from the first unchecked task in `README.md` (currently task 02, rewritten for a two-column hero + peach glow + scroll reveal). Tokens and utility classes (`.card`, `.btn`, `.btn-primary`, `.pill`, `.container`, `.display`) already exist: reuse them, do not recreate.

## Commands
`npm run dev` · `npm run build` (must pass) · `npm test` · `npx vercel` / push to Git for deploy

## Layout
```
src/{main,App}.tsx                    src/pages/{Landing,AppShell}.tsx
src/components/{landing/}            src/styles/{tokens,base}.css
src/engine/{forecast,canAfford,whatIf,suggest}.ts     src/data/{types,demo,store}.ts
src/ai/{client,fallback}.ts          src/lib/{format,dates,whatsapp}.ts
api/{parse,explain}.ts               tests/engine/      public/fonts/
```
