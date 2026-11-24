# Naya — Système de design (v4 — sans rose, vert en accent unique)

Référence unique pour tout le visuel. Remplace toute mention antérieure de rose/pêche.

## 1. Palette
| Rôle | Jeton | Clair | Sombre | Usage |
|---|---|---|---|---|
| Fond | `--bg` | `#f7f6f4` | `#15171a` | Dégradé doux vers `--bg-2` |
| Fond 2 | `--bg-2` | `#efece8` | `#1b1e22` | Second point du dégradé |
| Surface | `--surface` | `#ffffff` | `#1f2226` | Cartes non flottantes, champs |
| Encre | `--ink` | `#1c1c1e` | `#f2f1ef` | Texte principal |
| Encre douce | `--ink-soft` | `#6b6b70` | `#a9acb1` | Texte secondaire |
| Gris (secondaire) | `--grey` | `#9a9a9e` | `#7d8086` | Bordures, icônes inactives |
| Gris clair | `--grey-light` | `#e4e3e1` | `#2a2d31` | Fond des pastilles inactives |
| **Vert (accent unique)** | `--accent` | `#3c6e71` | `#4d8a8d` | Boutons principaux, états actifs, succès — **seule couleur vive de l'appli, à utiliser avec parcimonie** |
| Accent doux | `--accent-soft` | `#dde9e9` | `rgba(77,138,141,.2)` | Fond de pastille accent, halo |
| Alerte | `--warn` | `#b4532a` | `#e08a5f` | Zones rouges, manque d'argent |
| Verre (fond) | `--glass-bg` | `rgba(255,255,255,.55)` | `rgba(31,34,38,.55)` | Éléments « liquid glass » |
| Verre (bordure) | `--glass-border` | `rgba(255,255,255,.6)` | `rgba(255,255,255,.08)` | Liseré des éléments de verre |

Règle : le vert ne sert qu'à « action principale » ou « ça va bien ». Jamais de dégradé multicolore, jamais une deuxième couleur vive.

## 2. Liquid glass
`.glass-nav`, `.glass-card`, `.glass-row` : mêmes niveaux que la version précédente (flou 20/14/10px, bordures lumineuses discrètes), posés sur le dégradé `--bg`→`--bg-2`, jamais sur un fond uni.

## 3. Typographie
Titres : `.display` (police de titres existante du projet, gras). Corps : pile système (`-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`) — pas d'imitation de SF Pro, pas de police hébergée pour le corps de texte. Montants toujours en gras, jamais en fin.

## 4. Icônes
`lucide-react`, `strokeWidth={1.75}`, posées dans `.icon-pill` (fond `--grey-light` au repos, `--accent-soft` + icône `--accent` actif).

## 5. Mouvement — avec `motion`
- Changement d'écran : `AnimatePresence` + variants fondu/translateY(8px), 220ms.
- Pastille d'onglet actif : `layoutId` partagé entre onglets pour un glissement fluide automatique (`motion`), pas de calcul manuel de position.
- Apparition en cascade des cartes d'accueil : `staggerChildren` léger (~40ms), désactivé via `useReducedMotion()`.
- Hero flottant (landing) : légère oscillation continue (`animate={{y:[0,-10,0]}}`, `repeat: Infinity`), coupée sous `prefers-reduced-motion`.
Toute passe `motion` est une tâche séparée de la structure/logique de l'écran (voir `PLAN.md`).

## 6. Accueil — notifications d'abord
Ordre : 1-3 notifications concrètes (`.glass-card`) → carte résumé du mois (solde, mini-courbe) → listes (`.glass-row`). Jamais de camembert, jamais un tableau de bord à interpréter en premier.

## 7. Vérification visuelle (humain)
Après chaque tâche de design : le verre se voit-il ? un seul accent vert, utilisé avec parcimonie ? icônes toutes en pastilles cohérentes ? accueil = phrases avant chiffres ?
