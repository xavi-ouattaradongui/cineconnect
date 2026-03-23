import { db } from "../db/index.js";
import { films } from "../db/schema/films.js";
import { eq } from "drizzle-orm";

// Création d'un film
export const createFilm = async (req, res) => {
  const { imdbId, title, poster, year } = req.body;

  // Validation des champs obligatoires
  if (!imdbId || !title) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // Insertion en base (ignoré si le film existe déjà)
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

// Récupération d'un film par son imdbId
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
