# Task 06 — App shell, today screen, monthly needs
Read: TERAX.md + CAHIER_DES_CHARGES.md section 8 (screens 1 and 3) only.
Do:
1. `src/pages/AppShell.tsx` on `/app`: bottom tab bar (floating pill) with Accueil, Saisie, Prévision, Dettes. Context/provider for the state from `store.ts`, saved on every change.
2. Accueil: balance card, next deadline card, main alert card. Alert text comes from `src/ai/fallback.ts` templates for now (`shortfallMessage(date, amount)` etc.).
3. Needs list: each need with 3 priority pills (indispensable/important/confort), quick add form (label, amount, date, priority), delete. Use `<button onClick>`, no `<form>` tags if you hit issues.
4. Button "Réinitialiser la démo" in a small settings sheet.
Done when: adding a need changes the alert on Accueil, state survives a page reload, works at 375px, build passes. Commit and push.
