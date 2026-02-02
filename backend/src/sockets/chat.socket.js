import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    socket.on("joinFilm", ({ filmId }) => {
      socket.join(`film-${filmId}`);
      console.log(`🎬 User joined film ${filmId}`);
    });

    socket.on("sendMessage", async ({ content, filmId, userId }) => {
      if (!content || !filmId || !userId) return;

      const [message] = await db
        .insert(messages)
        .values({ content, filmId, userId })
        .returning();

      io.to(`film-${filmId}`).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected", socket.id);
    });
  });
};
