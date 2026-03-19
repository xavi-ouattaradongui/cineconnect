# Rapport de Projet - CineConnect

## 1. Introduction

CineConnect est une application web full stack orientee communaute, pensee pour les passionnes de cinema. L'objectif du projet est de proposer une experience plus sociale que les plateformes classiques de streaming, en permettant aux utilisateurs de decouvrir des films, de partager des avis et d'echanger en direct autour des oeuvres.

Le projet s'inscrit dans un cadre pedagogique progressif: d'abord la maitrise du frontend (React et routing), puis l'amelioration de l'interface, ensuite la modelisation de la base de donnees, et enfin l'integration backend complete avec securisation, temps reel et documentation API. Cette progression a permis de construire une application de maniere iterative, en separant les enjeux de chaque phase.

## 2. Objectifs du projet

Les objectifs principaux etaient les suivants:

- Concevoir une application monorepo claire, maintenable et evolutive.
- Mettre en place un frontend moderne avec navigation structuree.
- Construire un backend REST securise avec JWT.
- Integrer une base PostgreSQL via Drizzle ORM.
- Proposer un module de discussion temps reel avec Socket.io.
- Documenter l'API avec Swagger pour faciliter les tests et la soutenance.

Au-dela des objectifs techniques, le projet devait egalement repondre a des objectifs methodologiques: travail collaboratif, gestion de version, clarte de la documentation et capacite a justifier les choix effectues.

## 3. Architecture technique

L'architecture retenue repose sur un decoupage frontal/backend avec une base relationnelle:

- `frontend/`: application React (TanStack Router, TanStack Query, TailwindCSS).
- `backend/`: API Node.js/Express avec authentification JWT, logique metier et WebSocket.
- `shared/`: espace reserve au code mutualisable entre front et back.
- `docs/`: documentation projet (rapport, architecture, schema BDD, API).

Le frontend consomme deux sources de donnees:

- l'API backend pour les donnees applicatives (auth, reviews, favoris, messages, categories),
- l'API OMDb pour la recherche et l'affichage des contenus cinema.

Le backend joue un role central: validation des requetes, controle d'acces, persistance en base et diffusion d'evenements chat en temps reel.

## 4. Choix technologiques et justification

### Frontend

- **React** a ete choisi pour la modularite des composants et l'ecosysteme.
- **TanStack Router** structure les pages et les routes protegees.
- **TanStack Query** simplifie la gestion des appels API, du cache et des etats de chargement.
- **TailwindCSS** accelere la production UI tout en gardant une bonne coherence visuelle.
- **Vite** assure un cycle de developpement rapide.

### Backend

- **Node.js + Express** offrent une base simple et efficace pour une API REST.
- **Drizzle ORM** rend le schema SQL explicite et versionnable via migrations.
- **JWT** securise les endpoints sensibles et les actions utilisateur.
- **Socket.io** couvre le besoin de chat film en temps reel.
- **Swagger** rend l'API testable, lisible et exploitable en soutenance.

### Base de donnees

- **PostgreSQL** a ete retenu pour sa robustesse relationnelle.
- Le schema couvre les entites principales: utilisateurs, films, reviews, reactions, messages, favoris, listes personnelles et suivi de lecture chat.

## 5. Fonctionnalites implementees

Le projet inclut les fonctionnalites suivantes:

- Authentification complete: inscription, connexion, profil, mise a jour profil, changement mot de passe.
- Flux "mot de passe oublie": generation de token et reinitialisation.
- Gestion des films en base via identifiant IMDB (`imdbId`).
- Reviews: creation, consultation, modification, suppression.
- Reactions sur reviews: like/dislike avec comportement de bascule.
- Favoris et "ma liste": ajout, suppression, consultation par utilisateur.
- Chat par film en temps reel: envoi de message, reponse a message, suppression soft/hard, date de derniere lecture.
- Documentation Swagger accessible sur `/docs`.

Ces fonctionnalites permettent de demonstrer la coherence full stack du projet: les interactions UI ont un impact direct en base et sont securisees par les controles backend.

## 6. Securite, qualite et maintenabilite

La securite a ete traitee a plusieurs niveaux:

- Authentification JWT sur routes protegees.
- Verification de l'identite proprietaire pour les operations d'edition/suppression sensibles.
- Gestion CORS selon l'URL frontend configuree.

Sur la qualite logicielle, des efforts ont ete faits sur:

- la separation des responsabilites (routes, controllers, middlewares, schema),
- la lisibilite des structures,
- la documentation API et technique,
- la coherence des conventions de nommage et d'organisation.

## 7. Organisation de projet et collaboration

Le travail a ete mene en mode monorepo avec GitHub, afin de centraliser le code, les scripts et la documentation. La collaboration s'appuie sur une logique de decoupage par fonctionnalite, avec l'objectif de garder des contributions lisibles et revues.

Repartition type des roles (a adapter selon l'equipe reelle):

- Developpement frontend et experience utilisateur.
- Developpement backend et securite API.
- Modelisation BDD, migrations, documentation et soutenance.

Cette organisation permet de progresser en parallele tout en gardant une vision produit commune.

## 8. Difficultes rencontrees et solutions apportees

### 8.1 Alignement front/backend

Des ecarts de format de payloads sont apparus pendant l'integration. La solution a ete de stabiliser les contrats de reponse et de clarifier les champs attendus par endpoint.

### 8.2 Gestion des droits utilisateurs

Les operations critiques (reviews/messages) necessitaient un controle strict de propriete. Des verifications explicites sur `req.user.id` ont ete ajoutees dans les controllers.

### 8.3 Documentation API incomplete

Swagger ne couvrait initialement qu'une partie des routes. Des annotations ont ensuite ete ajoutees sur l'ensemble des domaines fonctionnels pour obtenir une documentation exploitable.

### 8.4 Gestion du chat

Le chat a demande un traitement specifique de la suppression de message et des reponses imbriquees. Une strategie soft delete puis hard delete a ete retenue pour conserver la lisibilite des conversations.

## 9. Limites actuelles et ameliorations envisagees

Le projet est fonctionnel, mais plusieurs axes d'amelioration sont identifies:

- Mettre en place une suite de tests unitaires et d'integration (Vitest/Jest).
- Renforcer les contraintes relationnelles autour des categories de films.
- Ajouter des filtres avances (annee, realisateur, note minimale).
- Ajouter un module de recommandations personnalisees.
- Completer l'observabilite (logs techniques, suivi des erreurs).

Ces evolutions permettraient d'augmenter la robustesse et la valeur produit sans remettre en cause l'architecture actuelle.

## 10. Conclusion

CineConnect repond aux attentes principales du cahier des charges: application full stack, securisee, documentee, et orientee usage reel. Le projet demontre la maitrise d'un flux de developpement complet, de la conception de schema de donnees jusqu'a l'interface utilisateur et la communication temps reel.

La base livree est suffisamment solide pour une demonstration de soutenance et pour des evolutions futures. Les choix techniques effectues privilegient la clarte, la modularite et la capacite de maintenance, ce qui constitue un resultat coherent avec les objectifs pedagogiques du module.
