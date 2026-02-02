import { db } from "../db/index.js";
import { messages } from "../db/schema/messages.js";
import { eq } from "drizzle-orm";

export const getMessagesByFilm = async (req, res) => {
  const { filmId } = req.params;

  const data = await db
    .select()
    .from(messages)
    .where(eq(messages.filmId, filmId))
    .orderBy(messages.createdAt);

  res.json(data);
};
