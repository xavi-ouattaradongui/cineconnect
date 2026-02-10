import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";
import { films } from "../db/schema/films.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    socket.on("joinFilm", ({ imdbId }) => {
      if (!imdbId) return;
      socket.join(`film-${imdbId}`);
      console.log(`🎬 User joined film ${imdbId}`);
    });

    socket.on("sendMessage", async ({ content, imdbId, userId, title, poster, year }) => {
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

      const [message] = await db
        .insert(messages)
        .values({ content, filmId: film.id, userId })
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
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected", socket.id);
    });
  });
};
