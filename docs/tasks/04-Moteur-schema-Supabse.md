# Tâche 04 — Moteur de calcul aligné sur le schéma Supabase
Lire ARCHITECTURE_DONNEES.md en entier avant de commencer (règles de calcul §3).
Les fichiers src/engine/*.ts existants datent de l'ancien modèle (localStorage) : ne pas les supprimer en bloc, mais vérifier chacun contre le nouveau schéma et réécrire ce qui ne correspond plus.
Fait :
1. src/engine/balance.ts : computeBalance(initialBalance, sales[], expenses[], repayments[]) -> nombre entier, formule exacte de ARCHITECTURE_DONNEES.md §3 (initial + Σ sales.amount_paid + Σ repayments.amount − Σ expenses.amount, lignes non annulées = deleted_at null).
2. src/engine/debt.ts : computeClientDebt(clientId, sales[], repayments[]) -> entier, formule §3 (Σ(amount_total−amount_paid) − Σ repayments.amount pour ce client, non annulées).
3. src/engine/forecast.ts : adapter forecast7d(balance, sales à venir, dépenses récurrentes déclarées) à la nouvelle formule §3. Garder la structure existante si elle correspond déjà, sinon réécrire.
4. canAfford.ts, whatIf.ts, suggest.ts : vérifier qu'ils appellent bien les nouvelles fonctions ci-dessus et plus l'ancien store local. Adapter les signatures si besoin.
5. tests/engine/ : réécrire les tests sur les nouveaux types (sales/expenses/repayments tels que définis dans ARCHITECTURE_DONNEES.md), garder au moins l'exemple chiffré de ce document comme test.
Fait quand : npm test passe entièrement sur les nouveaux types ; npm run build passe ; aucune fonction du moteur n'importe plus l'ancien src/data/state.tsx ou store local.