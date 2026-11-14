# Task 07 — Entry (text) with confirmation, no AI yet
Read: TERAX.md + CAHIER_DES_CHARGES.md sections 8 (screen 2) and 9.1 only.
Do:
1. `src/ai/fallback.ts`: `parseEntryFallback(text)` — simple rules for French phrases like "Kofi a pris 4 tas de tomates, 3000, il paie vendredi" (amount = number with optional spaces/F, client = capitalized word after "à"/before "a pris", weekday -> next date). If it cannot parse, return an empty draft.
2. Screen Saisie: text area with an example placeholder, "Envoyer" button -> confirmation card with editable lines (type, label, amount, client, date) -> "OK" saves, "Annuler" discards.
3. A confirmed debt line creates a `Debt`; a sale creates a `Sale`; a need creates a `Need`.
4. Tests for `parseEntryFallback` with at least 5 phrases.
Done when: the example phrase produces a correct editable line, confirming updates the debts list and the forecast, tests and build pass. Commit.
