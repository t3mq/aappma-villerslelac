# Plan de développement — Site Association de Pêche

Instructions : suis ce document étape par étape, dans l'ordre. Coche chaque case au fur et à mesure (remplace [ ] par [x]) en committant après chaque étape validée. Si un point est ambigu, propose une solution raisonnable plutôt que de bloquer, mais signale-le en commentaire.

## Étape 0 — Analyse
- [x] Analyser la maquette dans `doc/` (structure, sections, style visuel, palette, typographie)
- [x] Lister les photos disponibles dans `doc/photos/` et leur usage potentiel
- [x] Identifier les parties incomplètes ou manquantes de la maquette
- [x] Proposer une complétion cohérente avec le style existant (à valider avant de coder)

## Étape 1 — Site public (structure de base)
- [x] Header / navigation
- [x] Page d'accueil (hero + aperçu des 2-3 dernières actualités + présentation de l'association)
- [x] Footer avec lien "Admin" discret vers `/admin/login`
- [x] Site responsive (mobile / tablette / desktop)
- [x] Page 404 pour les adresses inconnues

## Étape 2 — Section Actualités (public)
- [x] Page liste des actualités (toutes)
- [x] Affichage : titre, date, texte, photo (optionnelle)
- [x] Bloc "dernières actus" sur la page d'accueil

## Étape 3 — Section Calendrier / Événements (public)
- [x] Liste des événements à venir (concours, sorties, dates d'ouverture/fermeture)
- [x] Affichage simple : titre, date, description

## Étape 4 — Section Documents (administration uniquement)
- [x] Registre des documents de l'association (règlement, cartes/permis, comptes rendus)
- [x] **Décision** : les documents ne sont **pas** publiés côté visiteur. Ils
      restent accessibles uniquement depuis l'espace d'administration ; l'API
      elle-même exige une authentification pour les lire.

## Étape 5 — Authentification admin
- [x] Page de connexion `/admin/login` (email + mot de passe)
- [x] Authentification réelle côté serveur (bcrypt + JWT, compte défini par
      variables d'environnement, tentatives de connexion limitées)

## Étape 6 — Espace admin
- [x] Dashboard admin avec accès aux sections suivantes :
  - [x] Gestion des actualités (créer / modifier / supprimer)
  - [x] Gestion des événements (créer / modifier / supprimer)
  - [x] Gestion des documents : envoi réel de fichiers par glisser-déposer,
        dossiers (création, imbrication), renommage, déplacement, téléchargement
  - [x] Gestion des adhérents (liste, ajout, modification, suppression, statut cotisation)
  - [x] Gestion de la galerie photos (ajout / suppression)
- [ ] **Reste à faire** : envoi de photos depuis le navigateur. Elles sont pour
      l'instant référencées par leur adresse dans `public/photos`. L'espace
      documents (multer + volume `uploads_data`) peut servir de modèle.

## Étape 7 — Finitions
- [x] Vérifier la cohérence visuelle entre toutes les pages
- [x] Vérifier le responsive sur toutes les pages, y compris admin
- [x] Nettoyer le code (composants réutilisables, pas de duplication)
- [x] Orthographe et typographie françaises (accents, apostrophes, ponctuation)
- [x] Gestion des erreurs et des états vides sur toutes les pages
- [x] Durcissement du déploiement (`.env.example`, `.gitignore`, healthchecks)
