# API - CineConnect

Base URL locale: `http://localhost:3000`
Swagger UI: `http://localhost:3000/docs`

## 1. Authentification

Les routes protégées attendent:

```http
Authorization: Bearer <JWT>
```

## 2. Endpoints principaux

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile` (JWT)
- `PUT /auth/profile` (JWT)
- `PUT /auth/change-password` (JWT)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Films

- `POST /films` (JWT)
- `GET /films/:imdbId`

### Reviews

- `POST /reviews` (JWT)
- `GET /reviews/film/:filmId`
- `PUT /reviews/:id` (JWT)
- `DELETE /reviews/:id` (JWT)
- `POST /reviews/:id/reaction` (JWT)

### Messages

- `GET /messages/film/:imdbId` (JWT)
- `POST /messages/film/:imdbId` (JWT)
- `DELETE /messages/:id` (JWT)
- `POST /messages/film/:imdbId/seen` (JWT)

### Favorites

- `GET /favorites` (JWT)
- `POST /favorites` (JWT)
- `DELETE /favorites/:imdbId` (JWT)

### MyList

- `GET /mylists` (JWT)
- `POST /mylists` (JWT)
- `DELETE /mylists/:imdbId` (JWT)

### Categories

- `GET /categories`
- `POST /categories`
- `POST /categories/init`

## 3. Exemples rapides

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPwd1!"
}
```

### Créer une review

```http
POST /reviews
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "filmId": "tt0133093",
  "rating": 9,
  "comment": "Excellent film",
  "title": "The Matrix",
  "poster": "https://...",
  "year": 1999
}
```

### Ajouter aux favoris

```http
POST /favorites
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "imdbId": "tt0133093",
  "title": "The Matrix",
  "poster": "https://...",
  "year": 1999
}
```

## 4. Réponses d'erreur fréquentes

- `400`: payload invalide / champs manquants
- `401`: non authentifié
- `403`: action interdite
- `404`: ressource introuvable
- `500`: erreur serveur

## 5. Temps réel (Socket.io)

Canal principal: discussion par film.

Événements utilisés:

- `joinFilm`
- `sendMessage`
- `deleteMessage`
