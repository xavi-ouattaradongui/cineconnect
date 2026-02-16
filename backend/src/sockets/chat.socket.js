import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";
import { films } from "../db/schema/films.js";
import { users } from "../db/schema/users.js";
import { eq, and } from "drizzle-orm";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    socket.on("joinFilm", ({ imdbId }) => {
      if (!imdbId) return;
      socket.join(`film-${imdbId}`);
      console.log(`🎬 User joined film ${imdbId}`);
    });

    socket.on("sendMessage", async ({ content, imdbId, userId, title, poster, year, replyToId }) => {
      if (!content || !imdbId || !userId) return;

      await db
        .insert(films)
        .values({ imdbId, title, poster, year })
        .onConflictDoNothing();

      const [film] = await db
        .select({ id: films.id })
        .from(films)
        .where(eq(films.imdbId, imdbId));

      if (!film) return;

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

        if (replyMsg && replyMsg.filmId === film.id) {
          const [replyUser] = await db
            .select({ id: users.id, username: users.username, displayName: users.displayName })
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
      }

      const [message] = await db
        .insert(messages)
        .values({ content, filmId: film.id, userId, replyToId: replyToId || null })
        .returning();

      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatar: users.avatar,
        })
        .from(users)
        .where(eq(users.id, userId));

      io.to(`film-${imdbId}`).emit("receiveMessage", {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        replyTo,
      });
    });

    socket.on("deleteMessage", async ({ messageId, imdbId, userId }) => {
      const [msg] = await db
        .select({ id: messages.id, userId: messages.userId, deletedAt: messages.deletedAt })
        .from(messages)
        .where(eq(messages.id, Number(messageId)));

      if (!msg) return;
      if (!msg.deletedAt && String(msg.userId) !== String(userId)) return;

      if (!msg.deletedAt) {
        const now = new Date();
        await db
          .update(messages)
          .set({ content: "Message supprimé", deletedAt: now })
          .where(eq(messages.id, Number(messageId)));
      }

      // Toujours soft delete côté socket : hardDeleted = false
      io.to(`film-${imdbId}`).emit("messageDeleted", { id: Number(messageId), hardDeleted: false });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected", socket.id);
    });
  });
};
