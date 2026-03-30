# Code Review — Questions / Réponses

Préparation basée sur le **vrai code** du projet. Pour chaque fichier : extrait exact, ce que tu dis, et les questions pièges avec réponses précises.

---

## 1 — `backend/src/middlewares/auth.middleware.js`

### Le code réel

```js
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }
  const token = authHeader.split(" ")[1]; // "Bearer XXXXX" → "XXXXX"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};
```

### Ce que tu dis si on te demande "à quoi sert ce fichier ?"

> C'est le gardien de toutes les routes protégées. À chaque requête, il lit le header `Authorization`, extrait le token JWT après `Bearer`, et vérifie sa signature avec `JWT_SECRET`. Si le token est valide, il place l'utilisateur décodé dans `req.user` pour que le controller sache qui fait la requête. Si le token est absent ou invalide, on renvoie 401 immédiatement.

### ❓ "Pourquoi utiliser un try/catch ici ?"

> Parce que `jwt.verify` lève une exception si le token est expiré, malformé ou signé avec la mauvaise clé. Sans try/catch, l'application planterait. Avec, on intercepte proprement et on renvoie un 401.

### ❓ "Que contient `req.user` exactement ?"

> Le payload du token : `{ id, email }` — les données encodées lors du `jwt.sign` dans le controller auth. Le mot de passe n'est jamais mis dans le token.

### ❓ "Que se passe-t-il si le token est expiré ?"

> `jwt.verify` lance une `TokenExpiredError`, attrapée par le catch. On renvoie un 401. Le frontend doit alors rediriger vers la page de connexion.

---

## 2 — `backend/src/controllers/auth.controller.js`

### Le code réel — register

```js
const validatePassword = (password) => ({
  isValid:
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password),
});

const hashedPassword = await bcrypt.hash(password, 10);

const [user] = await db.insert(users)
  .values({ username, email, password: hashedPassword, displayName: displayName || username })
  .returning({ id: users.id, username: users.username, email: users.email, ... });

const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: ... });
```

### Le code réel — login

```js
const [user] = await db.select().from(users)
  .where(or(eq(users.email, email), eq(users.username, email)));

if (!user) return res.status(401).json({ message: "Identifiants invalides" });

const isValid = await bcrypt.compare(password, user.password);

if (!isValid) return res.status(401).json({ message: "Identifiants invalides" });

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);
```

### Ce que tu dis si on te demande "comment fonctionne l'authentification ?"

> À l'inscription, le mot de passe est validé (5 règles), puis haché avec bcrypt avant d'être stocké. Un token JWT est généré dès l'inscription pour que l'utilisateur soit connecté directement. Au login, on accepte email ou username, on compare avec `bcrypt.compare`, et on génère un nouveau token si c'est correct.

### ❓ "Pourquoi bcrypt et pas MD5 ou SHA256 ?"

> MD5 et SHA256 sont rapides — dangereux pour les mots de passe car un attaquant peut tester des millions de combinaisons par seconde. Bcrypt est lent par conception (cost factor `10` ≈ 100ms par hash). Il intègre aussi un sel automatique, donc deux mêmes mots de passe donnent deux hashs différents.

### ❓ "Pourquoi le login accepte email OU username ?"

> Pour l'expérience utilisateur. On utilise un `or()` Drizzle qui génère `WHERE email = ? OR username = ?`. Les deux champs ont une contrainte `unique` en base, donc pas de doublon possible.

### ❓ "Pourquoi les deux erreurs renvoient le même message ?"

> C'est intentionnel : renvoyer des messages différents permettrait à un attaquant de savoir si un email est enregistré (user enumeration). En renvoyant toujours "Identifiants invalides", on ne révèle rien.

### ❓ "Que met-on dans le token JWT ?"

> Seulement `{ id, email }` — le minimum pour identifier l'utilisateur. Le payload JWT est encodé en base64 mais **pas chiffré** — il est lisible côté client. On n'y met donc jamais de données sensibles.

### ❓ "Comment fonctionne la validation du mot de passe ?"

> 5 règles : longueur ≥ 8, au moins une majuscule, une minuscule, un chiffre, et un caractère spécial parmi `@$!%*?&`. Si l'une échoue, on renvoie un 400 avant même de toucher la base.

---

## 3 — `backend/src/controllers/reviews.controller.js`

### Le code réel — createReview

```js
let [film] = await db.select().from(films).where(eq(films.imdbId, imdbId));
if (!film) {
  [film] = await db.insert(films)
    .values({ imdbId, title: req.body.title || "Unknown", poster, year })
    .returning();
}
const [review] = await db.insert(reviews)
  .values({ rating, comment, filmId: film.id, userId })
  .returning();
```

### Le code réel — toggleReaction

```js
const [existingReaction] = await db.select().from(reviewReactions)
  .where(and(eq(reviewReactions.reviewId, reviewId), eq(reviewReactions.userId, userId), eq(reviewReactions.type, type)));

if (existingReaction) {
  await db.delete(reviewReactions).where(eq(reviewReactions.id, existingReaction.id));
  return res.json({ action: "removed" });
} else {
  await db.delete(reviewReactions)
    .where(and(eq(reviewReactions.reviewId, reviewId), eq(reviewReactions.userId, userId)));
  await db.insert(reviewReactions).values({ reviewId, userId, type });
  return res.json({ action: "added" });
}
```

### Ce que tu dis si on te demande "comment une review est créée ?"

> On reçoit l'`imdbId` du film (qui vient d'OMDb). Comme le film n'existe pas forcément en base, on fait un "find or create" : on cherche le film, s'il n'existe pas on l'insère. Ensuite on insère la review liée à l'ID interne du film.

### ❓ "Pourquoi stocker les films en base alors qu'ils viennent d'OMDb ?"

> OMDb est une API externe — on ne peut pas y stocker nos données métier. Pour faire des jointures SQL, il faut un ID interne. On garde `imdbId` comme identifiant métier universel, et on génère un ID interne pour les relations.

### ❓ "Comment fonctionne le like/dislike exactement ?"

> Si l'utilisateur reclique sur le **même type** → on supprime la réaction (toggle off). S'il change de type (like → dislike) → on supprime d'abord toutes ses réactions sur cette review, puis on insère la nouvelle. Ça garantit qu'un utilisateur ne peut avoir qu'une seule réaction active à la fois.

### ❓ "Où est vérifié qu'on ne peut pas modifier la review de quelqu'un d'autre ?"

> Dans `updateReview` et `deleteReview`, on compare `existing.userId !== req.user.id`. Si ça ne correspond pas, on renvoie 403. Ce contrôle est fait côté **backend**, pas uniquement côté frontend.

### ❓ "Peut-on poster deux reviews sur le même film ?"

> Dans la version actuelle, il n'y a pas de contrainte unique `(userId, filmId)` au niveau du controller. C'est un axe d'amélioration identifié — une contrainte SQL `UNIQUE(user_id, film_id)` pourrait l'empêcher proprement.

---

## 4 — `backend/src/controllers/messages.controller.js`

### Le code réel — getMessagesByFilm (extrait)

```js
const repliedMessages = alias(messages, "replied_messages");
const repliedUsers = alias(users, "replied_users");

const data = await db.select({
  id: messages.id, content: messages.content, deletedAt: messages.deletedAt,
  userId: users.id, username: users.username,
  replyTo: {
    id: repliedMessages.id, content: repliedMessages.content, deletedAt: repliedMessages.deletedAt,
    userId: repliedUsers.id, username: repliedUsers.username,
  },
})
.from(messages)
.innerJoin(films, eq(messages.filmId, films.id))
.innerJoin(users, eq(messages.userId, users.id))
.leftJoin(repliedMessages, eq(messages.replyToId, repliedMessages.id))
.leftJoin(repliedUsers, eq(repliedMessages.userId, repliedUsers.id))
.where(eq(films.imdbId, imdbId));

// Masquage des messages supprimés
data.map(m => ({ ...m, content: m.deletedAt ? "Message supprimé" : m.content }))
```

### Ce que tu dis si on te demande "comment les messages sont récupérés ?"

> On joint la table `messages` deux fois avec des **alias** Drizzle pour gérer la relation auto-référentielle (un message peut répondre à un autre message de la même table). Si un message est supprimé (`deletedAt` non null), on remplace son contenu par "Message supprimé" côté serveur avant de renvoyer.

### ❓ "Pourquoi utiliser des alias ici ?"

> Parce qu'on joint la table `messages` sur elle-même (`replyToId`). Sans alias, SQL ne saurait pas distinguer les colonnes de la table principale de celles de la jointure. L'alias `replied_messages` et `replied_users` nomme explicitement chaque occurrence.

### ❓ "C'est quoi `userChatSeen` ?"

> Une table qui enregistre la date de dernière consultation du chat par utilisateur et par film. Elle sert à calculer les badges "nouveaux messages" : en comparant `lastSeenAt` avec `createdAt` des messages, on sait combien de messages ont été postés depuis la dernière visite.

---

## 5 — `backend/src/sockets/chat.socket.js`

### Le code réel — sendMessage

```js
socket.on("joinFilm", ({ imdbId }) => {
  if (!imdbId) return;
  socket.join(`film-${imdbId}`);
});

socket.on("sendMessage", async ({ content, imdbId, userId, title, poster, year, replyToId }) => {
  if (!content || !imdbId || !userId) return;
  await db.insert(films).values({ imdbId, title, poster, year }).onConflictDoNothing();
  const [message] = await db.insert(messages)
    .values({ content, filmId: film.id, userId, replyToId: replyToId || null })
    .returning();
  io.to(`film-${imdbId}`).emit("receiveMessage", { ...message, user, replyTo });
});
```

### Le code réel — deleteMessage (soft delete)

```js
socket.on("deleteMessage", async ({ messageId, imdbId, userId }) => {
  const [msg] = await db.select().from(messages).where(eq(messages.id, Number(messageId)));
  if (!msg) return;
  if (!msg.deletedAt && String(msg.userId) !== String(userId)) return; // contrôle propriétaire

  if (!msg.deletedAt) {
    await db.update(messages)
      .set({ content: "Message supprimé", deletedAt: new Date() })
      .where(eq(messages.id, Number(messageId)));
  }

  io.to(`film-${imdbId}`).emit("messageReplyDetached", { replyToId: Number(messageId), messageIds: replyIds });
  io.to(`film-${imdbId}`).emit("messageDeleted", { id: Number(messageId), hardDeleted: false });
});
```

### Ce que tu dis si on te demande "comment fonctionne le chat ?"

> Socket.io avec un système de rooms. Quand un utilisateur ouvre une fiche film, il émet `joinFilm` et rejoint la room `film-{imdbId}`. Quand il envoie un message, on le persiste en base et on le diffuse à toute la room. Le message peut être une réponse à un autre (`replyToId`), auquel cas on résout l'auteur du message cité pour l'afficher directement.

### ❓ "Quelle est la différence entre `socket.emit` et `io.to().emit` ?"

> `socket.emit` envoie uniquement à l'émetteur. `io.to('film-xyz').emit` envoie à **tous** les sockets dans la room, y compris l'émetteur. On utilise `io.to()` pour que tout le monde voie le message en temps réel.

### ❓ "Pourquoi `onConflictDoNothing` pour le film dans le socket ?"

> Le film est upserté à chaque envoi de message pour s'assurer qu'il existe en base. `onConflictDoNothing` évite une erreur si le film est déjà présent — on ne veut pas planter l'envoi de message à cause d'un doublon sur la contrainte `unique(imdb_id)`.

### ❓ "Comment fonctionne le soft delete de message ?"

> On pose un `deletedAt` et on remplace le `content` par "Message supprimé". Le message reste visible pour ne pas casser le fil des réponses. On émet aussi `messageReplyDetached` pour notifier en temps réel les messages qui citaient ce message supprimé.

### ❓ "Où est le contrôle de propriétaire dans le socket ?"

> Dans `deleteMessage`, on vérifie `String(msg.userId) !== String(userId)`. Si l'utilisateur qui tente de supprimer n'est pas l'auteur, on sort silencieusement. La conversion en string évite les bugs de comparaison entre `number` et `string`.

---

## 6 — `frontend/src/contexts/AuthContext.jsx`

### Le code réel

```js
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});
const [token, setToken] = useState(() => localStorage.getItem("token") || null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}, [user]);

useEffect(() => {
  if (token) {
    localStorage.setItem("token", token);
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      if (token && args[1]) {
        args[1].headers = args[1].headers || {};
        args[1].headers["Authorization"] = "Bearer " + token;
      }
      return originalFetch.apply(this, args);
    };
  } else {
    localStorage.removeItem("token");
  }
}, [token]);

const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage"));
};
```

### Ce que tu dis si on te demande "comment le frontend gère la connexion ?"

> `AuthContext` stocke le token **et** l'objet user dans le `localStorage` pour survivre aux rechargements. Quand le token change, un `useEffect` patch `window.fetch` pour injecter automatiquement le header `Authorization: Bearer <token>` dans tous les appels. Ça évite de devoir passer le token manuellement à chaque requête.

### ❓ "Pourquoi `useState` avec une fonction (lazy init) ?"

> Si on écrit `useState(localStorage.getItem("token"))`, la lecture s'exécute à **chaque rendu**. En passant `() => ...`, elle n'est appelée qu'une seule fois à l'initialisation. C'est une optimisation React classique pour les initialisations lentes.

### ❓ "Pourquoi stocker `user` en plus du `token` ?"

> Pour éviter un appel API supplémentaire `GET /auth/profile` au démarrage. On relit directement les infos utilisateur depuis le `localStorage`. Quand le profil est mis à jour, on remplace aussi l'entrée `localStorage` pour rester cohérent.

### ❓ "C'est quoi le patch de `window.fetch` ?"

> On remplace `window.fetch` par une version qui injecte automatiquement le header `Authorization` si un token est présent. Ça centralise la gestion du token — tous les appels API le reçoivent sans code supplémentaire dans chaque composant.

### ❓ "Pourquoi `window.dispatchEvent(new Event('storage'))` dans `logout` ?"

> Pour forcer un re-render global de tous les composants qui écoutent le `localStorage`. Certains composants peuvent lire directement le `localStorage` hors du contexte ; cet événement les notifie du changement.

---

## 7 — `frontend/src/routes/__root.jsx`

### Le code réel

```js
const requireAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) throw redirect({ to: "/login", replace: true });
};

const redirectIfAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) throw redirect({ to: "/", replace: true });
};

// Routes PUBLIQUES — pas de guard
new Route({ path: "/", component: Home });
new Route({ path: "film/$id", component: MovieDetails });

// Routes LOGIN — redirige si déjà connecté
new Route({ path: "login", component: Login, beforeLoad: redirectIfAuthenticated });
new Route({ path: "register", component: Register, beforeLoad: redirectIfAuthenticated });

// Routes PRIVÉES
new Route({ path: "favoris", component: Favorites, beforeLoad: requireAuth });
new Route({ path: "profil", component: Profile, beforeLoad: requireAuth });
new Route({ path: "profil/edition", component: ProfileEdit, beforeLoad: requireAuth });
new Route({ path: "profil/securite", component: ProfileSecurity, beforeLoad: requireAuth });
```

### Ce que tu dis si on te demande "comment les routes sont protégées ?"

> Il y a deux gardes. `requireAuth` bloque l'accès aux routes privées et redirige vers `/login` si pas de token. `redirectIfAuthenticated` fait l'inverse : sur les pages login/register, si tu es déjà connecté tu es redirigé vers l'accueil — ça évite d'accéder à la page de connexion quand on est déjà authentifié.

### ❓ "Pourquoi `replace: true` dans le redirect ?"

> Avec `replace: true`, la redirection ne crée pas d'entrée dans l'historique du navigateur. Si l'utilisateur appuie sur "Retour", il ne retombe pas sur la page qui a déclenché la redirection.

### ❓ "Est-ce qu'un utilisateur pourrait contourner le `requireAuth` côté frontend ?"

> Oui, en injectant un faux token dans le `localStorage`. Mais ça n'est pas un problème : la vraie sécurité est côté backend. Le middleware vérifie la signature du token à chaque requête. Un faux token sera rejeté avec 401.

### ❓ "Pourquoi les fiches films et catégories sont publiques ?"

> C'est un choix UX : un visiteur peut parcourir et lire sans s'inscrire. La friction réduite favorise la conversion. Les actions interactives (poster un avis, ajouter en favoris, accéder au chat) nécessitent une connexion.

---

## 8 — Questions générales d'architecture

### ❓ "Pourquoi un monorepo avec pnpm workspaces ?"

> Une seule commande `pnpm install` installe toutes les dépendances. Le dossier `shared/` permet de partager du code entre frontend et backend. C'est adapté à un projet de cette taille et évite la duplication de logique commune.

### ❓ "Pourquoi Drizzle ORM plutôt que Prisma ?"

> Drizzle génère du SQL lisible et des fichiers de migration explicites versionnables avec Git. Il n'a pas de daemon en arrière-plan (contrairement à Prisma). Le schéma est défini en JavaScript, ce qui le rend naturel dans un projet Node.js.

### ❓ "Pourquoi TanStack Query pour les appels API ?"

> TanStack Query gère automatiquement le cache, les états `isLoading`/`isError`, et la revalidation. Sans lui, on aurait des `useState` + `useEffect` verbeux pour chaque appel, avec des risques d'appels en double ou d'états obsolètes.

### ❓ "Qu'est-ce que le CORS et comment tu le gères ?"

> CORS bloque les requêtes entre origines différentes (ici `localhost:5173` → `localhost:3001`). On configure le middleware `cors` d'Express en autorisant uniquement l'URL définie dans `FRONTEND_URL` en variable d'environnement — pas en dur dans le code.

### ❓ "Pourquoi Socket.io et pas des WebSockets natifs ?"

> Socket.io ajoute la gestion des rooms, la reconnexion automatique, et un système d'événements nommés par-dessus les WebSockets. Sans ça, on devrait gérer manuellement la liste des connexions actives par film et le broadcast — beaucoup plus de code pour le même résultat.

---

## 9 — Reset de mot de passe (`auth.controller.js`)

### Le code réel — forgotPassword

```js
// Si l'email n'existe pas → 200 quand même
if (!user) {
  return res.status(200).json({ message: "Si l'email existe, vous recevrez un lien de réinitialisation" });
}

const resetToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

// On stocke le HASH en base, pas le token brut
await db.update(users)
  .set({ resetPasswordToken: hashedToken, resetPasswordExpires: expiresAt })
  .where(eq(users.id, user.id));

// On envoie le token BRUT par email
const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
await sendResetPasswordEmail(user.email, resetLink);
```

### Ce que tu dis si on te demande "comment fonctionne le reset de mot de passe ?"

> L'utilisateur soumet son email. On génère un token brut avec `crypto.randomBytes(32)`, on le hashe avec SHA-256 avant de le stocker en base, et on envoie le lien avec le token brut par email. Quand l'utilisateur clique, on rehashe le token de l'URL et on compare avec celui en base. Si valide et non expiré, on met à jour le mot de passe.

### ❓ "Pourquoi stocker un hash du token et pas le token brut ?"

> Si la base de données fuite, un attaquant ne peut pas utiliser un hash SHA-256 directement — il ne connaît pas le token brut. On envoie le token brut uniquement par email. Même logique que bcrypt pour les mots de passe : on ne stocke jamais ce qui permet de s'authentifier directement.

### ❓ "Pourquoi renvoyer un 200 si l'email n'existe pas ?"

> Sécurité anti-enumeration : renvoyer un 404 permettrait à un attaquant de savoir quels emails sont enregistrés. En renvoyant toujours le même message, on ne révèle rien sur la base d'utilisateurs.

### ❓ "C'est quoi `crypto.randomBytes(32)` ?"

> `crypto` est un module natif Node.js. `randomBytes(32)` génère 32 octets (256 bits) cryptographiquement aléatoires — impossible à deviner contrairement à `Math.random()`. On convertit en hexadécimal avec `.toString("hex")` pour l'envoyer dans une URL.

---

## 10 — Connexion à PostgreSQL (`backend/src/db/index.js`)

### Le code réel

```js
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

### ❓ "Comment tu te connectes à PostgreSQL ?"

> Via `pg.Pool` avec la `DATABASE_URL` en variable d'environnement. On passe le pool à `drizzle()` — c'est tout. Le pool gère automatiquement les connexions simultanées.

### ❓ "C'est quoi un pool de connexions ?"

> Plutôt qu'ouvrir et fermer une connexion à chaque requête SQL (lent), le pool maintient plusieurs connexions ouvertes et les distribue. `pg.Pool` en gère 10 par défaut. Dès qu'une requête se termine, la connexion retourne dans le pool et est réutilisable immédiatement.

### ❓ "Pourquoi mettre `DATABASE_URL` en variable d'environnement ?"

> Pour ne jamais committer les credentials de la base dans Git. En production, chaque environnement (dev, staging, prod) a sa propre URL. Si le `.env` est dans `.gitignore`, les identifiants ne se retrouvent jamais dans le dépôt.

---

## 11 — Service email (`backend/src/services/email.service.js`)

### Le code réel

```js
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",         // convention SendGrid SMTP
    pass: process.env.SENDGRID_API_KEY,
  },
});

export const sendResetPasswordEmail = async (email, resetLink) => {
  await transporter.sendMail({
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@cineconnect.com",
    to: email,
    subject: "Réinitialisation de votre mot de passe - CineConnect",
    html: `... lien expire dans 24 heures ...`,
  });
};
```

### ❓ "Quel service d'email tu utilises ?"

> SendGrid, via son interface SMTP avec Nodemailer. Le `user` est littéralement la chaîne `"apikey"` — c'est la convention SMTP de SendGrid. Le `pass` est la clé API stockée dans `SENDGRID_API_KEY` en variable d'environnement.

### ❓ "Pourquoi Nodemailer et pas l'API HTTP de SendGrid directement ?"

> Nodemailer abstrait le protocole SMTP et est compatible avec n'importe quel fournisseur (SendGrid, Gmail, Mailgun...). En changeant juste le `host` et les credentials, on peut changer de fournisseur sans toucher au reste du code.

### ❓ "Que se passe-t-il si l'envoi d'email échoue ?"

> Le `try/catch` dans `forgotPassword` attrape l'erreur et renvoie un 500 avec un message explicite. Le token a déjà été sauvegardé en base mais l'utilisateur n'a pas reçu le lien — il pourra refaire la demande.

---

## 12 — Mise à jour du profil (`auth.controller.js` — updateProfile)

### Le code réel

```js
if (email) {
  const [existingEmail] = await db.select().from(users).where(eq(users.email, email));
  if (existingEmail && existingEmail.id !== req.user.id) {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }
}

const updateData = {};
if (username) updateData.username = username;
if (email) updateData.email = email;
if (displayName !== undefined) updateData.displayName = displayName;
if (avatar !== undefined) updateData.avatar = avatar;

await db.update(users).set(updateData).where(eq(users.id, req.user.id));
```

### ❓ "Pourquoi vérifier manuellement les doublons plutôt que laisser PostgreSQL planter ?"

> Pour renvoyer un message d'erreur précis et lisible au frontend ("Cet email est déjà utilisé") plutôt qu'une erreur SQL générique. La contrainte `unique` en base reste en place comme dernier filet de sécurité.

### ❓ "Pourquoi construire `updateData` dynamiquement ?"

> Pour ne mettre à jour que les champs envoyés par le frontend. Si l'utilisateur veut seulement changer son `displayName`, on ne touche pas à `username` ou `email`. Sans ça, on écraserait les champs non envoyés avec `undefined`.

### ❓ "Comment s'assure-t-on qu'un utilisateur ne peut pas modifier le profil d'un autre ?"

> Le `WHERE eq(users.id, req.user.id)` : on met à jour uniquement la ligne dont l'ID correspond à l'utilisateur du token JWT. `req.user.id` vient du token vérifié par le middleware — pas du body de la requête.

---

## Récapitulatif — Les 16 points à connaître par cœur

1. **auth.middleware** → Vérifie JWT à chaque requête. Token absent ou invalide = 401 immédiat.
2. **register** → Validation 5 règles, hash bcrypt cost 10, token généré directement à l'inscription.
3. **login** → Email OU username acceptés, même message d'erreur dans les deux cas (anti-enumeration).
4. **JWT payload** → Seulement `{ id, email }`. Encodé base64, pas chiffré — jamais de données sensibles.
5. **reviews** → "Find or create" pour le film OMDb, puis insertion de la review liée à l'ID interne.
6. **toggleReaction** → Même type = toggle off. Type différent = suppression de l'ancienne + insertion nouvelle.
7. **update/delete review** → Contrôle `existing.userId !== req.user.id` → 403 si pas propriétaire.
8. **messages SQL** → Alias Drizzle pour la jointure auto-référentielle. `userChatSeen` pour les badges non-lus.
9. **chat socket** → Room `film-{imdbId}`, message persisté + diffusé. Soft delete avec `messageReplyDetached`.
10. **AuthContext** → Lazy init, user + token dans localStorage, patch `window.fetch` pour injecter le header auto.
11. **requireAuth** → Redirige vers `/login`. `redirectIfAuthenticated` → redirige vers `/` si déjà connecté.
12. **Sécurité réelle = backend** → Le frontend protège l'UX. Le backend rejette les tokens invalides. Les deux sont nécessaires.
13. **forgotPassword** → 200 même si l'email n'existe pas (anti-enumeration). Token brut par email, hash SHA-256 en base.
14. **crypto.randomBytes** → 256 bits aléatoires cryptographiquement sûrs. Impossible à deviner contrairement à Math.random().
15. **Pool PostgreSQL** → Connexions maintenues et réutilisées. 10 par défaut. DATABASE_URL en variable d'environnement.
16. **updateProfile** → `updateData` dynamique (seulement les champs envoyés). WHERE sur `req.user.id` — jamais le body.