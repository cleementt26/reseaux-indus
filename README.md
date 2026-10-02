# Réseaux · Réviser et comprendre

Site de révision en français : une vue d’ensemble interactive, les cours des séances 1 à 4, les cinq exercices du TD1 et les trois exercices du TD2, des schémas, des formules, des calculateurs et une méthode pour refaire le TP Packet Tracer.

[Ouvrir le site de révision](https://cleementt26.github.io/revision-reseaux-communication/)

## Hébergement

Site statique sans compilation ni dépendance externe. GitHub Pages doit publier la branche `main` depuis la racine (`/`). Les fichiers à conserver ensemble sont `index.html`, `styles.css`, `app.js` et `.nojekyll`.

## Mise à jour

Modifier les fichiers puis enregistrer les changements dans `main`. GitHub Pages republiera le site. Le TD2 et le CM séance 4 du 2 octobre sont intégrés : CAN, capteurs Python, temps réel, critères de choix d’un exécutif et ZigBee. Les ajouts sont conservés dans `work/td2-*.html`, `work/cm4-*.html`, `work/td2-can.js`, `work/td2-calculator.js` et `work/td2-can.css` du projet local ; `work/integrate-td2.py` assemble la version actuelle.

## Sources

Contenu pédagogique établi à partir des CM séances 1–3, du TD et de son corrigé, ainsi que du TP1. Ajout : énoncé du TD2, CM séance 4 lu entièrement (95 pages, tableaux des pages 21–25 inspectés visuellement), Python CAN/capteurs et correction manuscrite de l’exercice 2. Les exemples ajoutés sont identifiés dans le site. Les documents originaux et leurs liens Drive ne sont pas publiés.

Les fichiers `.pkt` n'ont pas été exécutés pour créer ce site. Les résultats rapportés dans le TP sont distingués des vérifications effectuées sur les calculateurs du site.

## Sur téléphone

Menu tactile avec fermeture, boutons d’au moins 44 px, champs lisibles sans zoom automatique et schémas défilables à leur taille de lecture. Les tableaux larges défilent dans leur propre zone.

## Besoin pédagogique à conserver

CAN et capteurs sont une priorité de révision pour un QCM qui pourra comporter des calculs. Partir de zéro : définir bus, nœud, bit, octet et trame avant les champs et les manipulations. Expliquer ce qui change quand on modifie ID, DATA, Remote ou N. Utiliser des phrases courtes, des essais concrets, des QCM corrigés et les calculs de PDR, distance et réserve moyenne. Distinguer le Python du réseau réel. Les identifiants se comparent comme des nombres ; DATA ne fixe pas la priorité.
