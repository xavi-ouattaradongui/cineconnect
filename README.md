# CineConnect

Plateforme sociale autour du cinéma: découverte de films, notes/avis, favoris, liste personnelle et discussion en temps réel.

Projet réalisé dans le cadre du module Web2 - HETIC.

## Présentation

[Voir la présentation de soutenance](https://view.genially.com/69c12229e48622b08152befb)

## Stack technique

- Frontend: React, TanStack Router, TanStack Query, TailwindCSS, Vite
- Backend: Node.js, Express, Drizzle ORM, JWT, Socket.io
- Base de données: PostgreSQL
- Documentation API: Swagger (`/docs`)
- Monorepo: pnpm workspaces

## Structure du monorepo

```txt
/frontend   Application React
/backend    API Express + Drizzle + Socket.io
/shared     Espace de code partagé (actuellement minimal)
/docs       Rapport, architecture, schéma BDD, API
```

## Prérequis

- Node.js 20+
- pnpm 10+
- PostgreSQL

## Installation

Depuis la racine:

```bash
pnpm install
```

## Variables d'environnement

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_OMDB_API_KEY=...
```

### Backend (`backend/.env`)

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/cineconnect
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@cineconnect.com
```

## Lancer le projet

### Backend

```bash
cd backend
pnpm dev
```

Backend disponible sur `http://localhost:3001`.
Swagger disponible sur `http://localhost:3001/docs`.

### Frontend

```bash
cd frontend
pnpm dev
```

Frontend disponible sur `http://localhost:5173`.

## Scripts utiles

### Frontend

```bash
pnpm --dir frontend dev
pnpm --dir frontend build
pnpm --dir frontend lint
pnpm --dir frontend preview
```

### Backend

```bash
pnpm --dir backend dev
pnpm --dir backend start
```

## Fonctionnalités principales

- Authentification JWT: inscription, connexion, profil, changement de mot de passe
- Récupération des films (OMDb côté front + persistance ciblée côté back)
- Reviews: création, édition, suppression, réactions like/dislike
- Favoris et ma liste
- Chat temps réel par film via Socket.io
- Reset password par email

## Documentation du projet

- Rapport: `docs/rapport.md`
- Architecture: `docs/architecture.md`
- Schéma base de données: `docs/schema-bdd.md`
- API: `docs/api.md`

## Organisation du projet

Projet réalisé en solo avec GitHub.
Deux branches : `master` (branche principale) et `xoxo` (branche de développement).

## État du projet

- Frontend: fonctionnel
- Backend: fonctionnel
- Swagger: routes principales documentées
- Documentation: fournie dans `docs/`
