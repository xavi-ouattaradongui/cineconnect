# Slides Canva - CineConnect

12 slides. Pour chaque slide: ce que tu mets dessus + ce que tu dis à l'oral.

---

## SLIDE 1 — Titre

**Sur la slide:**
> CineConnect
> Plateforme collaborative cinéma
> [Ton prénom] — HETIC — Web2 — 2026

**Tu dis:**
> Bonjour, on vous présente CineConnect, une plateforme web qui permet de découvrir des films, partager des avis et discuter en temps réel avec d'autres passionnés de cinéma.

---

## SLIDE 2 — Le problème

**Sur la slide:**
> Les plateformes de streaming = consultation. Pas d'interaction.
> Où discuter d'un film avec d'autres ?
> Notre réponse : CineConnect

**Tu dis:**
> On part d'un constat simple : on regarde des films partout, mais on discute autour d'un film nulle part facilement. CineConnect réunit dans un seul endroit la recherche, les avis, les favoris et le chat.

---

## SLIDE 3 — Fonctionnalités principales

**Sur la slide (liste):**
> - Rechercher des films
> - Donner une note et un commentaire
> - Liker ou disliker les avis des autres
> - Ajouter en favoris ou en liste perso
> - Discuter en temps réel sur chaque film

**Tu dis:**
> Concrètement, un utilisateur arrive sur l'accueil, explore les films, et dès qu'il est connecté il peut interagir : noter, commenter, réagir aux avis des autres, gérer ses listes et rejoindre le chat du film en direct.

---

## SLIDE 4 — Le parcours utilisateur

**Sur la slide:**
> Inscription / connexion
> Recherche d'un film
> Consulte ses détails
> Avis + favoris + liste
> Chat en temps réel

**Tu dis:**
> Cette slide permet de montrer le fil conducteur de l'application. L'utilisateur se connecte, recherche un film, consulte sa fiche, puis interagit avec le contenu grâce aux avis, aux favoris et au chat en temps réel.

---

## SLIDE 5 — Le stack technique

**Sur la slide (2 colonnes):**

| Frontend | Backend |
|---|---|
| React | Node.js + Express |
| TanStack Router | JWT (auth) |
| TanStack Query | Drizzle ORM |
| TailwindCSS | Socket.io |
| Vite | PostgreSQL |

**Tu dis:**
> Côté technique, on a un frontend React moderne et un backend Express. La base de données, c'est PostgreSQL avec Drizzle pour gérer le schéma. JWT sécurise les routes. Socket.io gère le chat en temps réel.

---

## SLIDE 6 — L'architecture

**Sur la slide (schéma simple) :**
```
Navigateur (React)
    |
    |--- HTTP / REST ---> Backend Express
    |--- Socket.io -----> Backend Express
    |--- OMDb API ------> (données films)
                              |
                         PostgreSQL
```

**Tu dis:**
> L'architecture est une séparation claire client/serveur. Le frontend appelle l'API REST pour toutes les données métier et utilise Socket.io pour le chat en temps réel. OMDb fournit les infos des films. PostgreSQL stocke tout le reste.

---

## SLIDE 7 — La sécurité JWT

**Sur la slide (3 étapes) :**
> 1. L'utilisateur se connecte → le backend crée un token JWT
> 2. Ce token est sauvegardé dans le navigateur
> 3. Chaque requête sensible envoie ce token → le backend vérifie

**Tu dis:**
> La sécurité repose sur JWT. Au login, le backend génère un token signé. Ce token est envoyé dans chaque requête protégée via le header Authorization. Un middleware vérifie le token côté backend. Sans token valide : réponse 401.

---

## SLIDE 8 — La demo [SLIDE VIDE ou screenshot]

**Sur la slide:**
> DEMO LIVE

*Ou mettre des screenshots de:*
- La page d'accueil
- Une fiche film avec les avis
- Le chat

**Tu dis:**
> [Ici tu fais la demo live — voir section demo ci-dessous]

---

## SLIDE 9 — Défis rencontrés et solutions

**Sur la slide:**
> - Faire communiquer correctement le frontend et le backend
> - Gérer les droits des utilisateurs
> - Mettre en place le chat en temps réel
> - Rendre l'application simple à utiliser
> - Organiser proprement le projet

**Tu dis:**
> Les principaux défis du projet ont été de bien connecter le frontend et le backend, de sécuriser les actions des utilisateurs, et de faire fonctionner le chat en temps réel de manière fluide. On a aussi cherché à garder une interface simple et claire pour que l'application reste facile à utiliser. Enfin, il fallait organiser le projet de façon propre pour séparer clairement le frontend, le backend et la documentation.

---

## SLIDE 10 — Les points forts de CinéConnect

**Sur la slide:**
> - Application full stack complète
> - Temps réel avec Socket.io
> - Authentification sécurisée
> - API documentée avec Swagger
> - Interface claire et moderne
> - Expérience utilisateur fluide

**Tu dis:**
> Cette slide sert à mettre en avant la cohérence globale du projet. CineConnect n'est pas seulement une interface : c'est une application complète avec une architecture claire, de la sécurité, du temps réel, une documentation API utilisable, une interface moderne, et une expérience utilisateur fluide pensée pour être simple à prendre en main.

---

## SLIDE 11 — Limites et suite

**Sur la slide:**
> Ce qu'on ferait ensuite :
> - Filtres avancés (année, genre, note min)
> - Recommandations personnalisées
> - Tests d'intégration complets
> - Observabilité (logs, monitoring erreurs)

**Tu dis:**
> L'application est fonctionnelle. Les prochaines étapes seraient d'enrichir l'expérience avec des filtres, des recommandations basées sur les goûts, et renforcer la fiabilité avec plus de tests automatisés.

---

## SLIDE 12 — Conclusion

**Sur la slide:**
> CineConnect : une application full stack complète
> Architecture claire, sécurisée et évolutive
> Merci pour votre attention — Questions ?

**Tu dis:**
> CineConnect répond à l'objectif initial : proposer une expérience cinéma communautaire complète, avec une base technique solide et évolutive. Merci pour votre attention, je suis disponible pour vos questions.

---

## DEMO LIVE (slide 8) — Ce que tu fais exactement

Dans l'ordre:

1. Ouvrir `http://localhost:5173` → montrer l'accueil public
2. Cliquer sur "Se connecter" → se login
3. Chercher un film dans la barre de recherche
4. Ouvrir la fiche film → montrer les infos
5. Poster un avis (note + commentaire)
6. Ajouter le film en favoris
7. Ouvrir 2 onglets sur le même film → envoyer un message → montrer qu'il arrive en direct
8. Ouvrir `http://localhost:3001/docs` → montrer Swagger rapidement

**Total démo : 4-5 minutes max.**

---

## AVANT DE PRÉSENTER — Checklist rapide

- [ ] Backend qui tourne (`pnpm --dir backend dev`)
- [ ] Frontend qui tourne (`pnpm --dir frontend dev`)
- [ ] Un compte email/mdp prêt
- [ ] Swagger qui s'ouvre
- [ ] 2 onglets ouverts sur la même fiche film

---

## SI ÇA BUG EN DIRECT

- Login bug → ouvrir Swagger et montrer `POST /auth/login` directement
- Chat bug → passer aux reviews/favoris et expliquer le principe
- Front plante → montrer l'architecture slide + Swagger

**Règle : ne jamais rester muet. Toujours expliquer ce qui aurait dû se passer.**
