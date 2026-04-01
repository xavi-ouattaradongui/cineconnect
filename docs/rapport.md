# Rapport de Projet - CineConnect

## 1. Introduction

CineConnect est une application web full stack orientée communauté, pensée pour les passionnés de cinéma. L'objectif du projet est de proposer une expérience plus sociale que les plateformes classiques de streaming, en permettant aux utilisateurs de découvrir des films, de partager des avis et d'échanger en direct autour des œuvres.

Le projet s'inscrit dans un cadre pédagogique progressif: d'abord la maîtrise du frontend (React et routing), puis l'amélioration de l'interface, ensuite la modélisation de la base de données, et enfin l'intégration backend complète avec sécurisation, temps réel et documentation API. Cette progression a permis de construire une application de manière itérative, en séparant les enjeux de chaque phase.

## 2. Objectifs du projet

Les objectifs principaux étaient les suivants:

- Concevoir une application monorepo claire, maintenable et évolutive.
- Mettre en place un frontend moderne avec navigation structurée.
- Construire un backend REST sécurisé avec JWT.
- Intégrer une base PostgreSQL via Drizzle ORM.
- Proposer un module de discussion temps réel avec Socket.io.
- Documenter l'API avec Swagger pour faciliter les tests et la soutenance.

Au-delà des objectifs techniques, le projet devait également répondre à des objectifs méthodologiques: travail en autonomie, gestion de version, clarté de la documentation et capacité à justifier les choix effectués.

## 3. Architecture technique

L'architecture retenue repose sur un découpage frontal/backend avec une base relationnelle:

- `frontend/`: application React (TanStack Router, TanStack Query, TailwindCSS).
- `backend/`: API Node.js/Express avec authentification JWT, logique métier et WebSocket.
- `shared/`: espace réservé au code mutualisable entre front et back.
- `docs/`: documentation projet (rapport, architecture, schéma BDD, API).

Le frontend consomme principalement l'API backend pour toutes les données applicatives (auth, films, reviews, favoris, messages, catégories). Le backend interroge ensuite OMDb pour la recherche et les détails film, avant de persister localement les données utiles.

Le backend joue un rôle central: validation des requêtes, contrôle d'accès, persistance en base et diffusion d'événements chat en temps réel.

## 4. Choix technologiques et justification

### Frontend

- **React** a été choisi pour la modularité des composants et l'écosystème.
- **TanStack Router** structure les pages et les routes protégées.
- **TanStack Query** simplifie la gestion des appels API, du cache et des états de chargement.
- **TailwindCSS** accélère la production UI tout en gardant une bonne cohérence visuelle.
- **Vite** assure un cycle de développement rapide.

### Backend

- **Node.js + Express** offrent une base simple et efficace pour une API REST.
- **Drizzle ORM** rend le schéma SQL explicite et versionnable via migrations.
- **JWT** sécurise les endpoints sensibles et les actions utilisateur.
- **Socket.io** couvre le besoin de chat film en temps réel.
- **Swagger** rend l'API testable, lisible et exploitable en soutenance.

### Base de données

- **PostgreSQL** a été retenu pour sa robustesse relationnelle.
- Le schéma couvre les entités principales: utilisateurs, films, reviews, réactions, messages, favoris, listes personnelles et suivi de lecture chat.

## 5. Fonctionnalités implémentées

Le projet inclut les fonctionnalités suivantes:

- Authentification complète: inscription, connexion, profil, mise à jour profil, changement mot de passe.
- Flux "mot de passe oublié": génération de token et réinitialisation.
- Gestion des films en base via identifiant IMDB (`imdbId`).
- Reviews: création, consultation, modification, suppression.
- Réactions sur reviews: like/dislike avec comportement de bascule.
- Favoris et "ma liste": ajout, suppression, consultation par utilisateur.
- Chat par film en temps réel: envoi de message, réponse à message, suppression soft/hard, date de dernière lecture.
- Documentation Swagger accessible sur `/docs`.

Ces fonctionnalités permettent de démontrer la cohérence full stack du projet: les interactions UI ont un impact direct en base et sont sécurisées par les contrôles backend.

## 6. Sécurité, qualité et maintenabilité

La sécurité a été traitée à plusieurs niveaux:

- Authentification JWT sur routes protégées.
- Vérification de l'identité propriétaire pour les opérations d'édition/suppression sensibles.
- Gestion CORS selon l'URL frontend configurée.

Sur la qualité logicielle, des efforts ont été faits sur:

- la séparation des responsabilités (routes, controllers, middlewares, schéma),
- la lisibilité des structures,
- la documentation API et technique,
- la cohérence des conventions de nommage et d'organisation.

## 7. Organisation du projet

L'organisation du travail s'est faite par phases fonctionnelles:

- Conception de l'architecture et modélisation de la base de données.
- Développement du backend (API REST, authentification JWT, sockets).
- Développement du frontend (interfaces, navigation, interactions utilisateur).
- Documentation technique, tests et préparation de la soutenance.

Ce fonctionnement a permis de garder une vision globale et cohérente du produit, avec des choix techniques homogènes entre frontend, backend et base de données.

## 8. Difficultés rencontrées et solutions apportées

### 8.1 Alignement front/backend

Des écarts de format de payloads sont apparus pendant l'intégration. La solution a été de stabiliser les contrats de réponse et de clarifier les champs attendus par endpoint.

### 8.2 Gestion des droits utilisateurs

Les opérations critiques (reviews/messages) nécessitaient un contrôle strict de propriété. Des vérifications explicites sur `req.user.id` ont été ajoutées dans les controllers.

### 8.3 Documentation API incomplete

Swagger ne couvrait initialement qu'une partie des routes. Des annotations ont ensuite été ajoutées sur l'ensemble des domaines fonctionnels pour obtenir une documentation exploitable.

### 8.4 Gestion du chat

Le chat a demandé un traitement spécifique de la suppression de message et des réponses imbriquées. Une stratégie soft delete puis hard delete a été retenue pour conserver la lisibilité des conversations.

## 9. Limites actuelles et améliorations envisagées

Le projet est fonctionnel, mais plusieurs axes d'amélioration sont identifiés:

- Mettre en place une suite de tests unitaires et d'intégration (Vitest/Jest).
- Renforcer les contraintes relationnelles autour des catégories de films.
- Ajouter des filtres avancés (année, réalisateur, note minimale).
- Ajouter un module de recommandations personnalisées.
- Compléter l'observabilité (logs techniques, suivi des erreurs).

Ces évolutions permettraient d'augmenter la robustesse et la valeur produit sans remettre en cause l'architecture actuelle.

## 10. Conclusion

CineConnect répond aux attentes principales du cahier des charges: application full stack, sécurisée, documentée, et orientée usage réel. Le projet démontre la maîtrise d'un flux de développement complet, de la conception de schéma de données jusqu'à l'interface utilisateur et la communication temps réel.

La base livrée est suffisamment solide pour une démonstration de soutenance et pour des évolutions futures. Les choix techniques effectués privilégient la clarté, la modularité et la capacité de maintenance, ce qui constitue un résultat cohérent avec les objectifs pédagogiques du module.
