# Naya — Cahier des charges

> Hackathon CREATE WITH AI · Lomé · samedi 14 novembre 2026 · soumission à 15h30 (lien déployé obligatoire)
> Document modulaire : chaque section `##` est autonome. Avec le modèle local, ne colle que **la section 0 + la tâche en cours**.

---

## 0. Contexte à coller à chaque session (≈ 15 lignes)

- **Naya** : appli web pour petites commerçantes de Lomé. Elle suit ventes et dettes clients, connaît les besoins du mois, et répond à « Puis-je me permettre ça ce mois-ci ? ».
- **Règle d'or** : le code calcule tous les chiffres. L'IA comprend (saisie → lignes de carnet) et explique (alertes en français simple). L'IA propose, les règles décident, l'utilisatrice valide.
- **Sans IA, l'appli fonctionne** (messages standards, saisie par formulaire).
- **Stack** : Vite + React + TypeScript, CSS simple (variables), données dans `localStorage`, déploiement Vercel.
- **Langue de l'interface** : français, tutoiement évité, vouvoiement chaleureux.
- **Monnaie** : FCFA, affichée « 45 000 F ».
- **Comptes** : chaque utilisatrice a un compte (email + mot de passe) stocké **en local** (`localStorage`). Aucune démo pré-remplie : chaque compte démarre à zéro. Pas de vrai backend (pas en production réelle).
- **Identité** : blanc et noir argenté, touche rose `#ff8fab` (anciennement pêche `#e0afa0`), thème clair **et** sombre, style « Floating UI » + « liquid glass » léger (verre sur navbar, modales, cartes clés).
- **Contrainte de contexte** : fichiers courts (< 150 lignes), une fonction = une responsabilité, pas de dépendance inutile.

---

## 1. Vision

| Élément | Contenu |
|---|---|
| Problème | Une commerçante vend à crédit, oublie qui lui doit quoi, et découvre trop tard qu'elle ne pourra pas réapprovisionner son stock ni payer ses charges. |
| Public | Petites commerçantes de marché à Lomé, déjà sur WhatsApp et mobile money. |
| Promesse | « Savoir avant lundi si j'aurai assez, et quoi reporter si non. » |
| Thématique hackathon | Entrepreneuriat et emploi (secondaire : Inclusion). |
| Différence | Elle regarde l'avenir (prévision par jour), gère des priorités, répond aux « et si ? » et agit (relance WhatsApp). |

> À valider ce soir avec 2-3 vraies commerçantes. Noter leurs phrases exactes. Aucun nom réel dans la présentation.

---

## 2. Périmètre

### Priorités pour samedi (couper à partir du bas)
1. Saisie texte (puis voix) avec écran de confirmation
2. Besoins et achats du mois, avec priorités
3. Prévision du mois avec « zones rouges »
4. Alertes expliquées par l'IA
5. « Puis-je me permettre ? » et « et si ce client ne paie pas ? »
6. Relance WhatsApp prête à envoyer

### Hors périmètre (feuille de route décembre)
Intégration T-Money/Flooz, éwé/kabiyè, mode hors ligne, fiche de crédibilité microcrédit, **auth serveur / vraie sécurité** (le compte est local, pas une prod réelle — voir pivot 02b).

### Pivot 02b — comptes + thème sombre + liquid glass (remplace la démo)
- **Plus de flux « Essayer la démo »** : le CTA de la landing devient **« Créer mon compte »** → inscription (email + mot de passe, stockage local uniquement). Page de connexion associée (vérification contre ce qui est stocké localement). Après succès → redirection vers `/app`.
- **Chaque compte démarre à zéro** : plus de données « Ama » pré-remplies dans l'app. Les exemples de chiffres restent uniquement sur la landing (illustration).
- **Stockage comptes** : `localStorage` — `naya-accounts` (map `email → {passwordHash, createdAt}`), `naya-session` (email actif). Hash côté client simple (pas de salage fort, pas en prod réelle). Données d'app par compte : `naya-state.<email>`.
- **Thème** : clair par défaut, **sombre** disponible via `@media (prefers-color-scheme: dark)` **et** bouton bascule manuel (`:root[data-theme="dark"]`, persisté dans `localStorage` `naya-theme`).
- **Liquid glass** (léger) : verre semi-transparent sur les éléments **flottants/superposés** (navbar, modales, cartes clés), pas sur le fond de page. Icônes outline uniformes. Transition douce (fondu + léger déplacement, ~200-250 ms, `ease-out`) sur le changement d'onglet/page, coupée sous `prefers-reduced-motion`.
- **Palette** : `--accent: #ff8fab`, `--accent-soft` éclaircie cohérente. Gris (`--ink`, `--silver`, `--silver-dark`) et blanc (`--bg`, `--surface`) conservés, réajustés en sombre.

---

## 3. Règles techniques

- Structure :
  ```
  src/
    pages/        Landing.tsx, Login.tsx, Signup.tsx, AppShell.tsx (tableau de bord)
    components/   cartes, boutons, champs
    engine/       forecast.ts, canAfford.ts, whatIf.ts (fonctions pures)
    ai/           parseEntry.ts, explain.ts, fallback.ts
    data/         types.ts, store.ts, auth.ts (comptes + session, localStorage)
    lib/          format.ts, dates.ts, whatsapp.ts
    hooks/        useTheme.ts (thème clair/sombre)
    styles/       tokens.css, base.css
  api/            parse.ts, explain.ts (fonctions serverless Vercel)
  tests/          engine/, lib/
  ```
- `engine/` : aucune dépendance, aucune IA, testable seule.
- **Important** : Qwen local sert à **coder**, pas à faire tourner l'appli déployée. L'IA de l'appli passe par une fonction serverless qui appelle un modèle hébergé (clé en variable d'environnement, jamais dans le code). Si elle échoue : `fallback.ts`.
- Aucune clé API côté navigateur.
- Accessibilité : contraste suffisant, boutons ≥ 44 px, `prefers-reduced-motion` respecté.

---

## 4. Identité visuelle

### Polices
- **Grand titre** : TeX Gyre Heros **Bold**, auto-hébergée en **OTF** (`public/fonts/texgyreheros-bold.otf`), via `@font-face` avec `font-display: swap`.
- Repli : `"TeX Gyre Heros", Helvetica, Arial, sans-serif`.
- Texte courant : même famille en Regular, ou police système.

### Tokens (`styles/tokens.css`)
```css
:root {
  --bg: #fafafa;            /* blanc cassé */
  --surface: #ffffff;
  --ink: #111214;           /* noir */
  --silver: #c9ccd1;        /* argenté */
  --silver-dark: #8b8f96;
  --accent: #ff8fab;        /* rose */
  --accent-soft: #ffe4ec;   /* éclairci cohérent (mélange ~85% blanc) */
  --danger: #c0392b;        /* zones rouges */
  --ok: #2f7d5b;
  --radius: 20px;
  --shadow-float: 0 12px 32px rgba(17,18,20,.10), 0 2px 6px rgba(17,18,20,.06);
}
/* Thème sombre : même variables redéfinies sous @media (prefers-color-scheme: dark)
   ET sous :root[data-theme="dark"] (bascule manuelle, persistée naya-theme). */
:root[data-theme="dark"] { /* + @media (prefers-color-scheme: dark) */
  --bg: #121214;            --surface: #1c1c1f;  --ink: #f2f2f3;
  --silver: #3a3c40;        --silver-dark: #9a9ca2; --accent: #ff8fab;
}
```

### Style « Floating UI » + « Liquid glass »
Éléments décollés du fond : cartes aux coins arrondis, ombres douces à deux couches, fine bordure argentée, espacement **généreux** (au moins `--space-6` entre deux cartes flottantes, jamais `--space-2`/`--space-3`). Icônes en **trait fin, contour, uniformes** (ex. Lucide, même épaisseur partout).
**Liquid glass (léger)** : sur les éléments **flottants/superposés seulement** (navbar, modales/feuillets, cartes clés) : fond semi-transparent `rgba` (α ≈ 0.6-0.75, selon le thème) + `backdrop-filter: blur(16-20px) saturate(140%)` + liseré translucide 1px (blanc/noir faible selon le thème), ombre douce conservée. **Pas de verre sur le fond de page.**
Sous chaque élément flottant (carte, pastille de navbar) : halo flou **rose `#ff8fab`**, ex. `box-shadow: 0 30px 60px -20px rgba(255,143,171,.45)` en plus de `--shadow-float`, jamais à la place.

### Logo
- Fichier source : `public/brand/logo-mark.png` (symbole seul, N stylisé noir/corail). Le mot-symbole complet (logo + « Naya ») n'existe qu'en image de référence (`public/brand/brand-sheet-reference.png`) : à reconstruire en HTML/SVG+texte, jamais en insérant cette image dans l'UI.
- Navbar flottante : symbole (`logo-mark.png`, `height: 28-32px`) + texte « Naya » en `.display`, graisse normale.
- Favicon/icône d'app : à dériver du symbole plus tard (hors périmètre samedi).
- Couleurs du symbole déjà alignées sur les tokens existants : noir `--ink`, dégradé corail proche de `--accent`/`--accent-soft`. Ne pas créer de nouvelles variables de couleur pour le logo.

---

## 5. Landing page (v2 — refonte du hero et du défilement)

**Route** : `/`. **Bouton principal « Créer mon compte » → `/signup`** (plus de lien vers une démo). Logo : voir section 4.

| Section | Contenu |
|---|---|
| Barre flottante | Pastille centrée en **verre liquide** (section 4), symbole + nom « Naya », bouton « Créer mon compte » → `/signup`, + bouton de bascule de thème (clair/sombre). |
| Hero | Disposition en **deux colonnes dès tablette** ; empilées sous 640px. Titre `.display` : « Savoir avant lundi. » puis ligne plus petite dans `--accent` : « Décider en toute sérénité. » Paragraphe : « Votre argent, vos échéances et vos prochaines dépenses enfin sous contrôle. » Bouton « Créer mon compte ». *(Variantes de ton B/C gardées en réserve.)* |
| Cartes flottantes (bloc hero) | 3 **cartes en verre liquide** à côté du texte, **halo rose `#ff8fab` flou** sous chacune, espacement généreux, légère animation flottante + apparition au chargement (voir pivot 02b). |
| Défilement (scroll reveal) | Chaque section suivante apparaît en flottant (fondu + remontée) à l'entrée du viewport ; une fois ; `IntersectionObserver`. |
| Comment ça marche | 3 étapes : Dictez · Naya prévoit · Vous décidez. |
| Pourquoi c'est sûr | « Les chiffres sont calculés par des règles, pas inventés par l'IA. » + « Vos données restent sur votre appareil. » |
| Appel final | Bouton « Créer mon compte » + lien « J'ai déjà un compte » (→ `/login`) + mention « Hackathon CREATE WITH AI ». |
| Pied de page | Nom, année, mention « Vos données restent sur votre appareil ». |

**Critères d'acceptation** : s'affiche bien sur iPhone Safari et Chrome Mac ; titre en TeX Gyre Heros Bold chargé ; aucune animation si `prefers-reduced-motion` ; pas de défilement horizontal ; verre liquide visible sur la navbar et les cartes ; halo rose discret ; **le CTA mène à l'inscription, pas à une démo**.

---

## 6. Modèle de données (`data/types.ts`)

```ts
type Priority = "indispensable" | "important" | "confort";

interface Need {          // sortie prévue
  id: string; label: string; amount: number;
  dueDate: string;        // AAAA-MM-JJ
  priority: Priority; recurring?: "weekly" | "monthly";
}
interface Debt {          // argent attendu d'un client
  id: string; client: string; amount: number;
  promisedDate: string; paid: boolean;
}
interface Sale {
  id: string; date: string; label: string; amount: number;
  clientName?: string; paidAmount: number;   // paidAmount < amount → crée une Debt
}
interface Profile {
  openingBalance: number;      // argent disponible aujourd'hui
  avgDailySales: number;       // ventes comptant habituelles par jour
}
```

---

## 7. Moteur de calcul (`engine/`)

Toutes les fonctions sont **pures** et testées avec des cas chiffrés.

- `forecast(profile, needs, debts, fromDate, toDate)` → tableau `{date, inflow, outflow, balance}[]` par jour.
  - entrées = ventes habituelles + dettes à leur date promise (non payées)
  - sorties = besoins à leur date
  - `redZones` = jours où `balance < 0`
- `canAfford(amount, date, priority, …)` → `{ ok, firstShortfallDate?, shortfall? }` (ajoute un besoin fictif et recalcule).
- `whatIfNotPay(clientId, …)` → nouvelle prévision sans cette dette.
- `suggest(forecast)` → liste d'actions ordonnées : reporter les besoins « confort » d'abord, puis « important » ; relancer les clients dont la date promise approche.

**Règles de test minimales** : un cas sans manque, un cas avec manque le 25, un cas où reporter un « confort » supprime la zone rouge.

---

## 8. Écrans de l'appli (`/app`)

1. **Accueil du jour** : solde, prochaine échéance, alerte principale (texte IA ou standard).
2. **Saisie** : champ texte (puis micro), exemple en placeholder, bouton envoyer → écran de confirmation avec lignes éditables → « OK ».
3. **Besoins du mois** : liste avec priorité (3 pastilles), ajout rapide.
4. **Prévision** : courbe/barres du solde par jour, zones rouges visibles, suggestions.
5. **« Puis-je me permettre ? »** : champ montant + date → réponse chiffrée ; bouton « et si [client] ne paie pas ? ».
6. **Dettes et relance** : liste des clients ; bouton WhatsApp ouvrant `https://wa.me/?text=…` avec message rédigé.

---

## 9. IA : rôles et contrats

### 9.1 Comprendre (`api/parse.ts`)
Entrée : phrase de la commerçante. Sortie **JSON uniquement** :
```json
{ "lines": [ { "type": "sale|debt|need", "label": "...", "amount": 3000,
  "client": "Kofi", "date": "AAAA-MM-JJ", "priority": "important" } ] }
```
- Le serveur **valide** le JSON (types, montants positifs). Invalide → erreur → saisie manuelle.
- L'utilisatrice confirme toujours avant enregistrement.

### 9.2 Expliquer (`api/explain.ts`)
Entrée : résultat chiffré du moteur. Sortie : 2-3 phrases en français simple. **Interdit de produire un chiffre absent de l'entrée.** Vérification côté code : tout nombre du texte doit exister dans l'entrée, sinon on affiche le message standard.

### 9.3 Fallback (`ai/fallback.ts`)
Messages standards par gabarit : « Il vous manquera {X} F le {date}. »

---

## 10. Plan de travail

### Aujourd'hui (vendredi)
| # | Tâche | Critère de fin |
|---|---|---|
| T1 | Créer le projet Vite + React + TS, déployer sur Vercel | Lien public ouvert sur Mac et iPhone |
| T2 | Tokens, polices, styles de base | Page de test avec titre en TeX Gyre Heros Bold |
| T3 | Landing page (section 5) | Critères d'acceptation validés |
| T4 | Types + données de démo (Ama) | `demo.ts` importable |
| T5 | Moteur `forecast`, `canAfford`, `whatIfNotPay` + tests | Tests verts |
| T6 | Question écrite aux organisateurs sur le code préalable | Message envoyé |

### Samedi (4 h 15 de développement, 10h00–12h30 puis 13h00–14h45)
| Horaire | Tâche |
|---|---|
| 10h00–10h45 | Écran Besoins + Accueil (brancher le moteur) |
| 10h45–11h30 | Saisie texte + confirmation (fallback d'abord, puis IA) |
| 11h30–12h30 | Prévision avec zones rouges + suggestions |
| 13h00–13h45 | « Puis-je me permettre ? » et « et si » |
| 13h45–14h15 | Alertes expliquées par l'IA + vérification des chiffres |
| 14h15–14h45 | Relance WhatsApp, puis voix si le temps le permet |
| 14h45–15h15 | Redéployer, tester sur iPhone, remplir la soumission |
| 15h15–15h30 | Envoi (ne pas attendre la dernière minute) |

---

## 11. Soumission (à préparer d'avance dans un fichier texte)

- Nom du projet et thématique
- Problématique (3 phrases, avec une phrase de commerçante interrogée)
- Solution proposée
- Public cible
- Fonctionnalités (liste courte)
- Outils d'IA et leur rôle (Qwen local pour coder, Terax, modèle hébergé pour l'IA de l'appli, etc.)
- Lien de déploiement fonctionnel

---

## 12. Risques

| Risque | Parade |
|---|---|
| IA indisponible ou lente | `fallback.ts`, l'appli marche sans IA |
| Voix capricieuse (surtout iPhone) | Clavier toujours disponible ; voix = bonus |
| Chiffre inventé par l'IA | Calcul en code + vérification des nombres du texte |
| Manque de temps | Couper depuis le bas de la liste de priorités (section 2) |
| Lien non fonctionnel à 15h30 | Déployer dès aujourd'hui, redéployer à chaque étape |
| Code préalable contesté | Message aux organisateurs ; dire ce qui existait avant le jour J |
| Clé API exposée | Variables d'environnement Vercel uniquement |
