# Task 01 — Check design tokens, font, base styles
Already provided: `src/styles/tokens.css` (spec section 4 + spacing scale + font variables), `src/styles/base.css` (reset, `@font-face`, `.display`, `.container`, `.card`, `.pill`, `.btn`, `.btn-primary`, reduced-motion rule), both imported in `src/main.tsx`, temporary page in `src/pages/Landing.tsx`.
Read: TERAX.md only (+ CAHIER_DES_CHARGES.md section 4 if you change a token).
Do:
1. Put the OTF in `public/fonts/` with the exact name used in `base.css` (`texgyreheros-bold.otf`), or edit the `src:` line of the `@font-face`.
2. `npm run dev`, open DevTools > Network > Font: the OTF must load (status 200). Title uses `.display`.
3. Check the page at 375px width: no horizontal scroll, both buttons >= 44px.
Done when: title renders in TeX Gyre Heros Bold, 375px layout is clean, `npm run build` passes. Commit and push.
