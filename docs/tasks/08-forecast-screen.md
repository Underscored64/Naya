# Task 08 — Forecast screen with red zones
Read: TERAX.md + CAHIER_DES_CHARGES.md section 8 (screen 4) only.
Do:
1. Screen Prévision: month range, one bar or column per day (plain CSS or SVG, no chart library), color by balance sign, red zones highlighted with a label of the first day and the missing amount.
2. Below: the suggestions from `suggest()` as cards with a button "Reporter" (moves the need by 7 days) or "Relancer" (opens the dettes screen on that client).
3. Tap on a day shows inflows and outflows of that day.
4. Alert wording comes from `fallback.ts` templates.
Done when: the demo shows a red zone, postponing the confort need removes it live, 375px layout is clean, build passes. Commit and push.
