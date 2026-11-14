# Task 09 — "Puis-je me permettre ?" and "et si ?"
Read: TERAX.md + CAHIER_DES_CHARGES.md section 8 (screen 5) only.
Do:
1. Card with amount field, date field (default today), priority pills, button "Vérifier".
2. Result card from `canAfford()`: ok in green, otherwise the first shortfall date and amount, plus the suggestions that would fix it. Wording from `fallback.ts`.
3. On Dettes, each client has "Et si cette cliente ne paie pas ?" showing before/after from `whatIfNotPay()` with the new red zone.
Done when: the pagne example (15 000 F) gives a clear answer with a date and amount, the "et si" on Esi changes the forecast preview, build passes. Commit.
