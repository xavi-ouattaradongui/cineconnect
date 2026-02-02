import { db } from "../db/index.js";
import { films } from "../db/schema/films.js";
import { eq } from "drizzle-orm";

export const createFilm = async (req, res) => {
  const { imdbId, title, poster, year } = req.body;

  if (!imdbId || !title) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [film] = await db
      .insert(films)
      .values({ imdbId, title, poster, year })
      .onConflictDoNothing()
      .returning();

    res.status(201).json(film);
  } catch {
    res.status(400).json({ message: "Film déjà existant" });
  }
};

export const getFilmByImdbId = async (req, res) => {
  const { imdbId } = req.params;

  const [film] = await db
    .select()
    .from(films)
    .where(eq(films.imdbId, imdbId));

  if (!film) {
    return res.status(404).json({ message: "Film non trouvé" });
  }

  res.json(film);
};
