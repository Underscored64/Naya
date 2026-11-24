# Naya — Plan de reconstruction (22 nov → 5 déc)

## Périmètre retenu pour le 5 décembre (voir ARCHITECTURE.md pour le détail des arbitrages)
Un seul espace financier · ventes/dépenses/dettes/remboursements · solde + prévision à 7 jours · accueil notifications d'abord · saisie texte + IA avec repli · rapport imprimable · pas de hors-ligne complet, pas de RAG, pas de push, pas de séparation pro/perso (tout en feuille de route).

## Phases et tâches
| # | Tâche | Dépend de |
|---|---|---|
| 00 | Audit de l'existant (dépôt, projet Vercel, variables d'env) — **aucune suppression avant cette tâche** | — |
| 01 | Nouveau scaffold Vite+React+TS dans le même dépôt, mêmes fichiers Vercel conservés | 00 |
| 02 | Projet Supabase : appliquer `ARCHITECTURE_DONNEES.md`, vérifier RLS | — (vous, hors Qwen) |
| 03 | Auth (inscription/connexion Supabase), session, page protégée | 01, 02 |
| 04 | Moteur de calcul (`engine/balance,debt,forecast`) + tests | 01 |
| 05 | Design tokens v4 (`DESIGN.md` §1-4, sans `motion` pour l'instant) | 01 |
| 06 | Saisie ventes/dépenses (formulaire), écriture Supabase via TanStack Query | 02,03,04 |
| 07 | Clients, dettes, remboursements | 06 |
| 08 | Accueil : notifications d'abord + carte résumé (structure, sans `motion`) | 04,06,07 |
| 09 | Passe `motion` sur l'accueil et la barre d'onglets (DESIGN.md §5) | 08 |
| 10 | IA : `api/parse.ts` + `api/explain.ts` + fallback | 06, et votre réponse sur le budget IA |
| 11 | Landing (hero, `motion` inclus cette fois) | 05 |
| 12 | Rapport imprimable | 04 |
| 13 | Vérification complète + déploiement final sur l'URL existante | tout |

Les tâches 06 à 13 seront détaillées une par une au fur et à mesure (comme pour Flowk), pas toutes d'un coup, pour rester dans la fenêtre de contexte de Qwen.

## Risques
| Risque | Parade |
|---|---|
| Supabase gratuit mis en pause après 7 jours sans activité | Ouvrir l'appli vous-même tous les 1-2 jours (déjà prévu) |
| `motion` alourdit des tâches que Qwen gère moins bien | Toujours séparer structure et animation en deux tâches |
| IA sans fournisseur choisi | Réponse budget nécessaire avant la tâche 10 |
| Périmètre qui regonfle en cours de route | Toute nouvelle idée va dans une section « feuille de route », pas dans le MVP, sauf accord explicite |
