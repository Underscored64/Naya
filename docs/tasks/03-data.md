# Task 03 — Types, demo data, storage
Read: TERAX.md + CAHIER_DES_CHARGES.md section 6 only.
Do:
1. `src/data/types.ts`: `Priority`, `Need`, `Debt`, `Sale`, `Profile` as in the spec (money = integer FCFA, dates = `YYYY-MM-DD`).
2. `src/lib/dates.ts`: `today()`, `addDays()`, `daysBetween()`, `eachDay(from, to)`, `monthRange(date)`. Work with UTC date parts only. Tests in `tests/lib/dates.test.ts`.
3. `src/lib/format.ts`: `formatF(45000)` -> `45 000 F`, `formatDate()` in French (ex. "vendredi 20 novembre").
4. `src/data/demo.ts`: `makeDemo(todayStr)` returns profile + needs + debts for Ama, dates relative to today. Include: weekly stock purchase 45 000 F (indispensable), tuition 25 000 F (indispensable), tontine 10 000 F (important), one pagne 15 000 F (confort), debts Esi 12 000 F (+3 days), Kofi 3 000 F (+5 days), Akouvi 8 000 F (+9 days), opening balance 38 000 F, average daily cash sales 4 000 F. Design the numbers so that a red zone appears around day 12 without any action.
5. `src/data/store.ts`: `loadState()`, `saveState()` (localStorage in try/catch, fallback to demo), `resetDemo()`.
Done when: `npm test` passes, `npm run build` passes. Commit.
