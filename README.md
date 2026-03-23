# CineConnect

Plateforme collaborative autour du cinema: decouverte de films, notes/avis, favoris, liste personnelle et discussion en temps reel.

Projet realise dans le cadre du module Web2 - HETIC.

## Presentation

[Voir la presentation de soutenance](https://view.genially.com/69c12229e48622b08152befb)

## Stack technique

- Frontend: React, TanStack Router, TanStack Query, TailwindCSS, Vite
- Backend: Node.js, Express, Drizzle ORM, JWT, Socket.io
- Base de donnees: PostgreSQL
- Documentation API: Swagger (`/docs`)
- Monorepo: pnpm workspaces

## Structure du monorepo

```txt
/frontend   Application React
/backend    API Express + Drizzle + Socket.io
/shared     Espace de code partage (actuellement minimal)
/docs       Rapport, architecture, schema BDD, API
```

## Prerequis

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
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=...
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

## Fonctionnalites principales

- Authentification JWT: inscription, connexion, profil, changement de mot de passe
- Recuperation des films (OMDb cote front + persistance ciblee cote back)
- Reviews: creation, edition, suppression, reactions like/dislike
- Favoris et ma liste
- Chat temps reel par film via Socket.io
- Reset password par email

## Documentation du projet

- Rapport: `docs/rapport.md`
- Architecture: `docs/architecture.md`
- Schema base de donnees: `docs/schema-bdd.md`
- API: `docs/api.md`

## Equipe et organisation

Projet realise en groupe (3 personnes max) avec GitHub.
Recommande: une branche par fonctionnalite + pull requests + revues croisees.

## Etat du projet

- Frontend: fonctionnel
- Backend: fonctionnel
- Swagger: routes principales documentees
- Documentation: fournie dans `docs/`
