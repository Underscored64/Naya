# Task 05 — canAfford, whatIfNotPay, suggest (tests first)
Read: TERAX.md + CAHIER_DES_CHARGES.md section 7 only.
Do:
1. `src/engine/canAfford.ts`: `canAfford({amount, date, priority}, state, range)` -> `{ ok, firstShortfallDate?, shortfall? }`. Adds a temporary need and reruns `forecast`. Never mutates the input.
2. `src/engine/whatIf.ts`: `whatIfNotPay(debtId, state, range)` -> `{ before, after, newRedZones }`.
3. `src/engine/suggest.ts`: `suggest(state, range)` -> ordered `Suggestion[]` with `kind: "postpone" | "remind"`, target id, and `resolvesShortfall: boolean`. Rule: postpone "confort" needs first, then "important", never "indispensable"; propose reminders for debts due before the first red day. Check whether each action alone removes the red zone by rerunning `forecast`.
4. Tests in `tests/engine/`: affordable purchase; purchase that creates a shortfall on a known date; Esi not paying creates a red zone; postponing the "confort" need removes it.
Done when: `npm test` passes, `npm run build` passes. Commit.
