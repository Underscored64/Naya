# Naya — Architecture générale (Livrable 2, consolidé)

## Schéma
```
Navigateur (React/TS/Vite) ──HTTPS──► Vercel
  │                                     ├─ Fichiers statiques (build Vite)
  │                                     └─ Edge Functions : api/parse.ts, api/explain.ts
  │                                             │ (clé IA en variable d'env, jamais exposée)
  │                                             ▼
  │                                     Fournisseur IA cloud (1 seul, voir ARCHITECTURE_IA.md)
  └──HTTPS (clé publique + RLS)──► Supabase (Postgres + Auth)
```

## Responsabilités
- **Front** : formulaires, affichage, état de session (Supabase Auth), lecture/écriture Supabase via TanStack Query, appel aux Edge Functions pour la compréhension/explication IA.
- **Edge Functions** : seules à détenir la clé IA ; valident le JSON reçu du modèle à la main ; ne touchent jamais directement la base — elles renvoient une proposition, le front l'écrit après confirmation.
- **Supabase** : source de vérité unique des montants (voir `ARCHITECTURE_DONNEES.md`). RLS : `auth.uid() = user_id` sur toutes les tables, lecture et écriture, aucune policy de suppression physique.

## Décisions technologiques retenues (avec alternative écartée et pourquoi)
| Domaine | Retenu | Écarté | Pourquoi |
|---|---|---|---|
| Backend | Supabase | Backend custom (Node+VM) | Auth + Postgres + RLS prêts à l'emploi ; pas de serveur à maintenir pour une présentation le 5 décembre |
| État serveur | TanStack Query | Redux Toolkit | Évite de dupliquer le cache que Supabase/TanStack gère déjà ; moins de code à produire par Qwen |
| Animations | `motion` | CSS seul | Choix explicite de l'utilisateur pour des effets riches ; en échange, les tâches d'interface sont scindées en deux passes (structure, puis `motion`) |
| IA — contexte | Lecture directe des dernières opérations Supabase | RAG (embeddings) | Volume de données trop faible pour justifier une base vectorielle au lancement ; RAG gardé en option si le planning le permet, grâce à `src/ai/` isolé |
| Rapports | Page HTML imprimable (`window.print()`) | Génération PDF serveur | Zéro dépendance serveur en plus, résultat identique pour l'utilisatrice |
| Hors-ligne | Brouillon local en cas d'échec réseau, pas de file de synchronisation | Sync complète avec résolution de conflits | Risque de double comptabilisation trop élevé pour le délai |
| Espaces financiers | Un seul espace pour le 5 décembre | Séparation pro/personnel avec transferts tracés | Reporté en feuille de route — voir `CAHIER_DES_CHARGES.md` §Périmètre |

## Préservation de l'URL Vercel
Le dépôt GitHub actuel reste le dépôt lié au projet Vercel `naya-io`. On ne supprime jamais ce projet. Le code existant est remplacé par un nouveau scaffold **dans ce même dépôt** (voir tâche 00 — audit avant toute suppression), poussé sur la branche existante : Vercel redéploie automatiquement sur la même URL.
