# Naya — Architecture IA (Livrable 4, brouillon — fournisseur à confirmer)

## Flux
1. Front envoie le texte brut (jamais l'historique financier complet) à `api/parse.ts`.
2. La fonction appelle le fournisseur IA avec un prompt qui demande **uniquement** un JSON `{type, montant, client?, categorie?, credit?}`.
3. Validation à la main du JSON (champs attendus, montant = entier positif, type dans une liste fermée). Invalide → repli (`src/ai/fallback.ts` : formulaire classique).
4. Le JSON proposé s'affiche à l'utilisatrice pour confirmation. **Rien n'est écrit en base avant sa confirmation explicite.**
5. `api/explain.ts` : reçoit un résultat déjà calculé par `src/engine/` (jamais l'inverse) et le reformule en phrase simple. L'IA ne reçoit jamais un chiffre qu'elle pourrait reformuler différemment du calcul.

## Sécurité (reprend §9.6 du cadrage)
- Contrôle en code que tout nombre présent dans le texte généré par l'IA existe déjà dans les données envoyées en entrée — sinon on rejette la phrase et on utilise le gabarit de repli.
- Clé IA uniquement en variable d'environnement Vercel, jamais dans le code ni dans un fichier commité.
- L'IA ne reçoit jamais l'identifiant d'un autre utilisateur ni de requête à exécuter elle-même : elle ne fait qu'analyser du texte et en recevoir en retour, jamais d'accès direct à Supabase.

## Coûts, à trancher avec vous
Avant de choisir un fournisseur précis, il me faut savoir : **avez-vous un budget mensuel en tête pour les appels IA** (même approximatif, ou « le moins cher possible »), et combien d'opérations par jour environ sont réalistes pour la démo (quelques dizaines suffisent à estimer un coût). Avec cette réponse, je compare 2-3 fournisseurs (coût, qualité du français, fiabilité du JSON) et je recommande, plutôt que de choisir sur la seule popularité comme le cadrage le demande.

## Défaillance IA
Si l'appel échoue ou dépasse un délai court (ex. 10s), bascule immédiate sur `fallback.ts` : saisie par formulaire classique, phrases d'explication en gabarits fixes. L'appli ne bloque jamais sur l'IA.
