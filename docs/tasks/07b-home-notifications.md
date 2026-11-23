# Tâche 07b — Accueil : notifications d'abord, coque de l'appli premium
Touche `src/pages/AppShell.tsx`, l'écran d'accueil de l'appli, et la barre d'onglets. Lire `docs/DESIGN.md` §4, §5 et §7 avant de commencer.
Fait :
1. Réordonner l'accueil selon §7 : notifications (`.glass-card`, 1 à 3, générées à partir de l'état réel du compte — dettes en retard, zone rouge à venir — jamais de texte inventé par l'IA ici, uniquement des gabarits de phrase remplis par le code) **en premier**, puis la carte résumé du mois, puis les listes (`.glass-row`).
2. Si le compte est neuf (aucune donnée) : une seule carte d'accueil chaleureuse invitant à ajouter sa première vente/besoin, pas une liste vide inquiétante.
3. Barre d'onglets : chaque onglet = `.icon-pill`, fond actif qui **glisse** d'un onglet à l'autre (transform translateX animé, §5), jamais de simple changement de couleur instantané.
4. Apparition en cascade courte (§5) des cartes de l'accueil au premier affichage de l'écran (pas à chaque re-render).
5. Vérifier que les montants restent dans `.display`/gras (jamais en police fine) même dans les nouvelles cartes.
Fait quand : `npm run build` passe ; sur un compte neuf, l'accueil montre une invite chaleureuse, pas une page vide ; sur un compte avec données de test, les notifications apparaissent au-dessus de la carte résumé ; changer d'onglet fait glisser le fond actif plutôt que de le faire disparaître/réapparaître ; `prefers-reduced-motion` supprime toutes les animations de cette tâche.
