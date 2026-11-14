# Naya — Plan détaillé

## 1. Décisions déjà prises
- Appli **web** (Vite + React + TypeScript), déployée sur Vercel. Pas de Docker, pas de base de données, pas de comptes.
- Données dans `localStorage`, commerçante fictive « Ama » pour la démo.
- Règle d'or : le code calcule, l'IA comprend et explique, la commerçante valide.
- Identité : blanc et noir argenté, touche `#e0afa0`, style Floating UI, titres en TeX Gyre Heros Bold.
- Qwen 27b local (via Terax) sert à écrire le code. L'IA de l'appli déployée passe par `api/` (modèle hébergé) avec repli sans IA.

## 2. Points à régler (par ordre d'urgence)
| # | Point | Qui | Quand |
|---|---|---|---|
| 1 | Entretiens avec 2-3 commerçantes (5 questions, phrases exactes) | Toi | Vendredi |
| 2 | Message aux organisateurs : code préalable autorisé ? crédits fournis ? | Toi | Vendredi |
| 3 | Choix du modèle hébergé pour `api/` et obtention d'une clé | Toi | Avant samedi 10h |
| 4 | Police `texgyreheros-bold.otf` dans `public/fonts/` | Toi | Vendredi |

## 3. Phases

### Phase A — Vendredi (socle, sans IA)
| Tâche | Contenu | Durée visée |
|---|---|---|
| 00 | Socle fourni : installer, dépôt Git, déploiement Vercel | 15 min |
| 01 | Tokens et styles fournis : déposer la police OTF, vérifier | 10 min |
| 02 | Landing page Floating UI | 1 h 30 |
| 03 | Types, données de démo, stockage | 30 min |
| 04 | Moteur `forecast` + tests | 1 h |
| 05 | `canAfford`, `whatIfNotPay`, `suggest` + tests | 1 h |

### Phase B — Samedi 10h00–12h30 (cœur de l'appli)
| Tâche | Contenu |
|---|---|
| 06 | Coque de l'appli, accueil du jour, besoins du mois |
| 07 | Saisie texte + confirmation (analyse de secours sans IA) |
| 08 | Écran prévision avec zones rouges et suggestions |

### Phase C — Samedi 13h00–14h45 (valeur ajoutée)
| Tâche | Contenu |
|---|---|
| 09 | « Puis-je me permettre ? » et « et si ce client ne paie pas ? » |
| 10 | Dettes et relance WhatsApp |
| 11 | IA serverless : comprendre (`parse`) et expliquer (`explain`) |
| 12 | Voix (bonus, couper si le temps manque) |

### Phase D — Samedi 14h45–15h30
| Tâche | Contenu |
|---|---|
| 13 | Gel du code à 14h45, redéploiement, test iPhone, texte de soumission, envoi avant 15h15 |

## 4. Ordre de coupe si le temps manque
12 (voix) → 11 (IA, l'appli reste complète avec le repli) → 10 (relance) → 09. **Ne jamais couper** 04, 05, 06, 08 et le déploiement.

## 5. Parcours de la démo (3 minutes)
1. Landing : le problème en une phrase, une phrase de commerçante interrogée.
2. Accueil d'Ama : « Lundi il vous faut 45 000 F, vous en avez 38 000 F. »
3. Dictée d'une vente à crédit → confirmation → la prévision change.
4. « Puis-je acheter un pagne à 15 000 F ? » → réponse chiffrée avec la date du manque.
5. « Et si Esi ne paie pas ? » → la zone rouge apparaît → bouton relance WhatsApp.
6. Phrase finale : les chiffres sont calculés par des règles, l'IA explique.

## 5 bis. Ce que le jury évalue (règlement)
Pertinence du problème, utilité, apport de l'IA, fonctionnement du prototype, expérience utilisateur, potentiel. Le vote du public pèse 40 % : soigner la landing et l'interface.

## 6. Risques et parades
| Risque | Parade |
|---|---|
| IA lente ou indisponible | Repli sans IA dans toute fonction IA |
| Voix capricieuse sur iPhone | Clavier toujours présent, voix en bonus |
| Chiffre inventé par l'IA | Calcul en code + contrôle des nombres du texte |
| Agent local qui tourne en rond | Une tâche à la fois, 3 essais max, puis on copie l'erreur ici |
| Lien non fonctionnel à 15h30 | Déployer dès vendredi, redéployer à chaque tâche |
| Code préalable contesté | Message aux organisateurs ; dire ce qui existait avant le jour J |
