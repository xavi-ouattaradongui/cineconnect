import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";
import { films } from "../db/schema/films.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const getMessagesByFilm = async (req, res) => {
  const { imdbId } = req.params;

  const data = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      userId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatar: users.avatar,
    })
    .from(messages)
    .innerJoin(films, eq(messages.filmId, films.id))
    .innerJoin(users, eq(messages.userId, users.id))
    .where(eq(films.imdbId, imdbId))
    .orderBy(messages.createdAt);

  res.json(data);
};

export const createMessage = async (req, res) => {
  const { imdbId } = req.params;
  const { content, title, poster, year } = req.body;

  if (!content || !imdbId) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  await db
    .insert(films)
    .values({ imdbId, title, poster, year })
    .onConflictDoNothing();

  const [film] = await db
    .select({ id: films.id })
    .from(films)
    .where(eq(films.imdbId, imdbId));

  if (!film) {
    return res.status(400).json({ message: "Film introuvable" });
  }

  const [message] = await db
    .insert(messages)
    .values({ content, filmId: film.id, userId: req.user.id })
    .returning();

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, req.user.id));

  res.status(201).json({
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
  });
};
