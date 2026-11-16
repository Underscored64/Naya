# Tâche 02b — Pivot : comptes + thème sombre + liquid glass

Remplace le flux de démo « Ama » par une authentification locale (stockage
uniquement), ajoute un thème sombre et applique un style « liquid glass » léger.
Une **étape = un commit**, chacune vérifiée **dans le navigateur** (`npm run dev`),
pas seulement `npm run build`.

## Contexte
- Lire `TERAX.md` + les sections **0, 4, 5** (et pivot 02b) de
  `docs/CAHIER_DES_CHARGES.md`.
- Landing v2 et coque d'app déjà en place. Le store retombe aujourd'hui sur la démo
  `Ama` : c'est à supprimer.

## Étapes

### A — Palette + thème sombre + bascule
1. `src/styles/tokens.css` :
   - `--accent: #ff8fab` ; `--accent-soft` éclairci cohérent (mélange ~85 % blanc, ex. `#ffe4ec`).
   - Conserver `--ink`, `--silver`, `--silver-dark` (gris) et `--bg`, `--surface` (blanc).
   - Thème sombre : redéfinir les variables sous `@media (prefers-color-scheme: dark)` **ET**
     sous `:root[data-theme="dark"]` : `--bg ≈ #121214`, `--surface ≈ #1c1c1f`,
     `--ink ≈ #f2f2f3`, `--silver`/`--silver-dark` réajustés, `--accent` reste `#ff8fab`.
2. `src/hooks/useTheme.ts` (+ ou `main.tsx`) : lit `prefers-color-scheme` par défaut, un
   bouton bascule pose `data-theme="light"|"dark"` sur `<html>`, mémorisé dans
   `localStorage` (`naya-theme`).
3. Bascule de thème dans la navbar (landing) et/ou dans les réglages de l'app.
4. Halos des cartes/navbar alignés sur le nouvel accent rose `#ff8fab`.

### B — Auth + suppression de la démo
1. `src/data/auth.ts` : hash côté client simple ; `naya-accounts` (map
   `email -> {passwordHash, createdAt}`), `naya-session` (email actif). Fonctions
   `signup`, `login`, `logout`, `getSession`.
2. `src/pages/Signup.tsx` (email + mot de passe) et `src/pages/Login.tsx`
   (vérif. contre le compte local). Sur succès → redirection vers `/app`.
3. `src/App.tsx` : routes `/signup`, `/login` ; `/app` **protégé** (sans session → `/signup`).
4. `src/data/store.ts` / `src/data/state.tsx` : état **par compte** (`naya-state.<email>`),
   **état vide par défaut**. Supprimer le fallback `makeDemo` et toute donnée « Ama »
   pré-remplie dans l'app.
5. Landing : le CTA principal devient **« Créer mon compte »** → `/signup` ; lien
   « J'ai déjà un compte » → `/login`. Retirer toute mention de la démo « Ama » dans l'UI
   (Footer, WhySafe, SettingsSheet).

### C — Liquid glass + icônes + transitions
1. Classe(s) `.glass` : fond `rgba` α ≈ 0.6-0.75 (selon le thème) +
   `backdrop-filter: blur(16-20px) saturate(140%)` + liseré translucide 1px (blanc/noir
   faible selon le thème) + ombre douce conservée. Appliquer aux éléments **flottants/
   superposés** : navbar, modales/feuillets (SettingsSheet), cartes clés — **pas le fond**.
2. Icônes : contour/outline uniforme (Lucide déjà en use) — taille + épaisseur homogènes,
   jamais d'icône remplie à côté d'icônes en contour.
3. Transitions de navigation (TabBar / AppShell) : fondu + léger déplacement ~200-250 ms
   `ease-out`, **coupées sous `prefers-reduced-motion`**.

### D — Vérifs navigateur
- Bascule clair/sombre visible immédiatement ; verre liquide visible sur la navbar et les
  modales ; inscription puis connexion mènent à `/app` ; **aucune donnée « Ama »** visible
  pour un nouveau compte ; `npm run build` et `npm test` passent.

## Done when
- Palette rose + thème sombre (auto + manuel) fonctionnent ; bascule persistée.
- Flux `signup → /app` et `login → /app` ; `/app` redirige vers `/signup` sans session.
- Nouveau compte démarre à zéro (pas de données « Ama »).
- Verre liquide sur navbar/modales/cartes clés, pas sur le fond ; icônes outline uniformes ;
  transition d'onglets douce (coulée sous reduced-motion).
- Chaque étape commitée séparément, après validation visuelle.
