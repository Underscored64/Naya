# Réglages de l'IA locale (Ollama + Terax) — à faire une fois

1. **Ollama à jour**, puis récupérer le modèle déjà téléchargé ou `ollama pull` selon ta version (le nom exact du modèle MLX peut varier : vérifie avec `ollama list`).
2. **Fenêtre de contexte, étape cruciale.** Si le contexte est trop petit, l'agent « oublie » le début et paraît stupide. Fixe 32768 (tu peux tester plus si la RAM le permet) :
   - `OLLAMA_CONTEXT_LENGTH=32768 ollama serve`
   - ou un `Modelfile` avec `FROM <ton modèle>` et `PARAMETER num_ctx 32768`, puis `ollama create naya-code -f Modelfile`.
3. Dans Terax : ajoute le fournisseur Ollama (`http://localhost:11434`), choisis le modèle, ouvre le dossier du projet. Terax lit `TERAX.md` à la racine.

## Méthode (petite fenêtre de contexte)
- Une tâche à la fois : « Lis TERAX.md et docs/tasks/NN-….md, propose un plan court, puis implémente. »
- Ne jamais coller `CAHIER_DES_CHARGES.md` en entier : seulement la section citée par la tâche.
- Après chaque tâche : `npm test` et `npm run build` passent, puis commit. Si ça casse, corriger **avant** de continuer.
- Si l'agent tourne en rond (3 essais sans progrès) : arrête, copie l'erreur exacte et le fichier concerné, et demande ici.
- Ne le laisse pas ajouter de bibliothèque ni changer la structure.
- Une session trop longue dégrade les réponses : ouvre une nouvelle session entre deux tâches.
