# TERAX.md — Contexte du projet Naya (à lire en premier, à chaque session)

## What we are building
**Naya** : appli web pour petites commerçantes de Lomé. Elle suit ventes, dépenses, dettes clients et remboursements, et répond à « Puis-je me permettre ça ce mois-ci ? ».
**Règle d'or** : le code calcule tous les montants. L'IA comprend une saisie en langage naturel et explique des résultats — elle n'invente jamais un chiffre et n'écrit jamais en base elle-même. L'utilisatrice confirme toujours avant qu'une opération soit enregistrée.
**Principe d'accueil** : l'écran d'accueil montre d'abord 1 à 3 phrases concrètes (notifications), pas un tableau de bord à interpréter. Les chiffres et graphiques viennent ensuite, en résumé.
Présentation devant jury : **5 décembre 2026**. Reconstruction en cours depuis le 22 novembre, vous seul.

## Ce qui a changé par rapport à l'ancienne version
- Ancien stockage `localStorage` + comptes locaux → remplacé par **Supabase** (Postgres + Auth + Row Level Security). Vrais comptes, vraies données isolées par utilisatrice.
- Palette : **plus de rose**. Blanc (dominant), gris/argent (secondaire), **vert `#3c6e71` en accent unique**, utilisé avec parcimonie (boutons principaux, états actifs, succès).
- Animations : bibliothèque **`motion`** (ex-Framer Motion) pour de vrais effets d'interface, pas du CSS seul.
- Un seul espace financier pour cette version (pas de séparation pro/personnel pour le 5 décembre — voir `docs/ARCHITECTURE.md` pour le périmètre exact retenu).

## Stack (ne pas changer sans demander)
- Vite + React 18 + TypeScript **strict**.
- **Supabase** : Postgres, Auth (email + mot de passe), Row Level Security sur toutes les tables (`auth.uid() = user_id`).
- **TanStack Query** pour les données Supabase (pas Redux Toolkit).
- **`motion`** pour les animations d'interface ; CSS classique (variables, voir `docs/DESIGN.md`) pour la mise en page et le « liquid glass ».
- Tests : `vitest`, sur le moteur de calcul (`src/engine/`) uniquement.
- IA : fonctions serverless Vercel (`api/parse.ts`, `api/explain.ts`), jamais de clé IA côté navigateur.
- Icônes : `lucide-react`, toujours posées dans une pastille (`.icon-pill`, voir `docs/DESIGN.md`).
- UI en français (vouvoiement, chaleureux, sans jargon). Code et commentaires en anglais.

## Règles dures
1. Montants en FCFA = **entiers**, jamais de flottant (le FCFA n'a pas de sous-unité).
2. `src/engine/` = fonctions pures, aucune dépendance React/Supabase/IA, une fonction = un test vitest.
3. Aucune écriture en base n'est déclenchée par l'IA directement : elle renvoie une proposition, l'utilisatrice confirme, **puis** le front écrit dans Supabase (RLS fait barrière).
4. Aucune suppression physique de `sales`/`expenses`/`repayments` : correction = nouvelle ligne + `deleted_at` sur l'ancienne + entrée dans `audit_log` (voir `docs/ARCHITECTURE_DONNEES.md`).
5. Toute fonctionnalité IA a un repli sans IA (`src/ai/fallback.ts`). L'appli fonctionne IA coupée.
6. Pas de clé Supabase « service role » ni de clé IA dans le code front ou dans un fichier commité — uniquement en variables d'environnement Vercel.
7. Respecter `prefers-reduced-motion` : toute animation `motion` doit être désactivable (utiliser son hook dédié).
8. Fichiers courts (< 150 lignes). Une tâche à la fois, depuis `docs/tasks/NN-*.md`.

## Comment travailler
- Lire ce fichier + la tâche du jour (+ la section citée de `docs/CAHIER_DES_CHARGES.md` ou `docs/ARCHITECTURE_DONNEES.md` si la tâche le demande). Jamais tout un document en entier.
- Plan court → implémentation → vérifications listées dans la tâche → `git add -A && git commit -m "task NN: ..."` → `git push` (Vercel redéploie sur l'URL existante).
- Ne jamais toucher à `vercel.json`, aux réglages du projet Vercel, ou à un remote Git sans qu'une tâche le demande explicitement (voir tâche 00).

## État (à tenir à jour)
Phase 0 (audit) en cours. Voir `docs/PLAN.md` pour l'ordre des tâches.

## Arborescence cible
```
src/{main,App}.tsx                 src/pages/{Landing,Login,Signup,AppShell}.tsx
src/components/{landing/,app/,ui/} src/styles/{tokens,base}.css
src/engine/{balance,debt,forecast}.ts                 src/data/{types,queries}.ts  (Supabase via TanStack Query)
src/ai/{client,fallback}.ts        src/lib/{format,dates}.ts
api/{parse,explain}.ts             supabase/schema.sql   tests/engine/
```
