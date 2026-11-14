# Task 02 — Landing page (Floating UI)
Read: TERAX.md + CAHIER_DES_CHARGES.md section 5 only.
Do:
1. `src/pages/Landing.tsx` on route `/`, with react-router. Route `/app` shows a placeholder for now.
2. Floating pill navbar (sticky, centered, backdrop blur, silver border): "Naya" + button "Essayer la démo" -> `/app`.
3. Hero: `.display` title "Savoir avant lundi si vous aurez assez.", one-sentence subtitle, primary button.
4. Three floating cards with offsets and a slow up/down animation (CSS keyframes, disabled under `prefers-reduced-motion`): "Lundi : il vous faut 45 000 F", "Esi vous doit 12 000 F vendredi", "Puis-je acheter ce pagne ? Oui, mais attention le 25."
5. Section "Comment ça marche": 3 steps (Dictez, Naya prévoit, Vous décidez) with lucide icons.
6. Section "Pourquoi c'est sûr": numbers computed by rules, AI only explains, demo data are fictional.
7. Final call to action and footer ("Hackathon CREATE WITH AI", year, fictional data notice).
8. One component file per section in `src/components/landing/`.
Done when: no horizontal scroll at 375px, looks good on iPhone Safari and Chrome Mac, animations stop with reduced motion, `npm run build` passes. Push and open the Vercel URL on the iPhone.
