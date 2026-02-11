import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";
import { films } from "../db/schema/films.js";
import { users } from "../db/schema/users.js";
import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const getMessagesByFilm = async (req, res) => {
  const { imdbId } = req.params;

  const repliedMessages = alias(messages, "replied_messages");
  const repliedUsers = alias(users, "replied_users");

  const data = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      userId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatar: users.avatar,
      replyTo: {
        id: repliedMessages.id,
        content: repliedMessages.content,
        userId: repliedUsers.id,
        username: repliedUsers.username,
        displayName: repliedUsers.displayName,
      },
    })
    .from(messages)
    .innerJoin(films, eq(messages.filmId, films.id))
    .innerJoin(users, eq(messages.userId, users.id))
    .leftJoin(repliedMessages, eq(messages.replyToId, repliedMessages.id))
    .leftJoin(repliedUsers, eq(repliedMessages.userId, repliedUsers.id))
    .where(eq(films.imdbId, imdbId))
    .orderBy(messages.createdAt);

  res.json(
    data.map((m) => ({
      ...m,
      replyTo: m.replyTo?.id ? m.replyTo : null,
    }))
  );
};

export const createMessage = async (req, res) => {
  const { imdbId } = req.params;
  const { content, title, poster, year, replyToId } = req.body;

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

  let replyTo = null;
  if (replyToId) {
    const [replyMsg] = await db
      .select({
        id: messages.id,
        content: messages.content,
        userId: messages.userId,
        filmId: messages.filmId,
      })
      .from(messages)
      .where(eq(messages.id, replyToId));

    if (!replyMsg || replyMsg.filmId !== film.id) {
      return res.status(400).json({ message: "Message de réponse invalide" });
    }

    const [replyUser] = await db
      .select({
        id: users.id,
        username: users.username,
        displayName: users.displayName,
      })
      .from(users)
      .where(eq(users.id, replyMsg.userId));

    replyTo = {
      id: replyMsg.id,
      content: replyMsg.content,
      userId: replyMsg.userId,
      username: replyUser?.username,
      displayName: replyUser?.displayName,
    };
  }

  const [message] = await db
    .insert(messages)
    .values({ content, filmId: film.id, userId: req.user.id, replyToId: replyToId || null })
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
    replyTo,
  });
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  const [msg] = await db
    .select({ id: messages.id, userId: messages.userId })
    .from(messages)
    .where(eq(messages.id, Number(id)));

  if (!msg) {
    return res.status(404).json({ message: "Message introuvable" });
  }

  if (msg.userId !== req.user.id) {
    return res.status(403).json({ message: "Action non autorisée" });
  }

  await db.delete(messages).where(and(eq(messages.id, Number(id)), eq(messages.userId, req.user.id)));

  return res.json({ id: msg.id });
};
