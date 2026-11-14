Placez ici la police **TeX Gyre Heros Bold** au format **OTF**, sous le nom `texgyreheros-bold.otf`
(nom officiel dans le paquet TeX Gyre). Si votre fichier porte un autre nom, renommez-le **ou** modifiez
la ligne `src: url("/fonts/…")` de la règle `@font-face` dans `src/styles/base.css`.

- Seule la graisse Bold est déclarée (titres `.display`). Le texte courant utilise la police système.
- Sans le fichier, le site reste lisible (repli Helvetica/Arial) ; seule une requête 404 apparaît dans la console.
- Licence : GUST Font License (famille TeX Gyre), qui autorise l'auto-hébergement.
