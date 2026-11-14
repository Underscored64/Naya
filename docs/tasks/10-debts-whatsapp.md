# Task 10 — Debts and WhatsApp reminders
Read: TERAX.md + CAHIER_DES_CHARGES.md section 8 (screen 6) only.
Do:
1. Screen Dettes: list sorted by promised date, overdue in accent color, buttons "Marquer payé" and "Relancer".
2. `src/lib/whatsapp.ts`: `reminderMessage(debt, tone)` (template, polite by default) and `whatsappLink(message)` -> `https://wa.me/?text=` + `encodeURIComponent(message)`. Phone number optional field per client; if present use `https://wa.me/<number>?text=`.
3. "Relancer" shows the message in an editable box, then opens the link in a new tab.
4. Tests for the message and the link encoding (accents, spaces).
Done when: the link opens WhatsApp with the message prefilled (test on iPhone), build and tests pass. Commit and push.
