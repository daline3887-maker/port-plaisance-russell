# Port de Plaisance Russell

Projet Node.js / Express / MongoDB réalisé à partir du cahier des charges CEF.

## Fonctionnalités
- authentification par session ;
- mots de passe hachés avec bcrypt ;
- CRUD des catways ;
- CRUD des réservations ;
- CRUD des utilisateurs ;
- contrôle des dates et des chevauchements de réservations ;
- tableau de bord avec réservations en cours ;
- documentation de l'API accessible sur `/docs` ;
- import des fichiers `catways.json` et `reservations.json` fournis.

## Installation
1. Installer Node.js 18 ou supérieur et disposer d'une base MongoDB.
2. Copier `.env.example` vers `.env` et renseigner les variables.
3. Exécuter `npm install`.
4. Exécuter `npm run seed` pour importer les données et créer le compte administrateur initial.
5. Exécuter `npm run dev` (développement) ou `npm start`.
6. Ouvrir `http://localhost:3000`.

## Routes principales
- `/` : accueil et connexion
- `/dashboard` : tableau de bord (authentification requise)
- `/docs` : documentation API
- `/api/...` : API REST (authentification requise)

## Avant mise en production
- utiliser une valeur longue et aléatoire pour `SESSION_SECRET` ;
- utiliser des identifiants administrateur forts ;
- configurer `MONGODB_URI` avec la base de production ;
- activer HTTPS sur l'hébergeur.
