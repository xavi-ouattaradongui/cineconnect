import { db } from "../db/index.js";
import { favorites } from "../db/schema/favorites.js";
import { films } from "../db/schema/films.js";
import { eq, and, desc } from "drizzle-orm";

export const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const userFavorites = await db
      .select({
        id: favorites.id,
        filmId: films.id,
        imdbId: films.imdbId,
        title: films.title,
        poster: films.poster,
        year: films.year,
        createdAt: favorites.createdAt,
      })
      .from(favorites)
      .innerJoin(films, eq(favorites.filmId, films.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    res.json(userFavorites);
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des favoris" });
  }
};

export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { imdbId, title, poster, year } = req.body;

  if (!imdbId || !title) {
    return res.status(400).json({ message: "Données manquantes" });
  }

  try {
    // Créer ou récupérer le film
    let [film] = await db
      .select()
      .from(films)
      .where(eq(films.imdbId, imdbId));

    if (!film) {
      [film] = await db
        .insert(films)
        .values({ imdbId, title, poster, year })
        .returning();
    }

    // Vérifier si déjà dans les favoris
    const [existing] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.filmId, film.id)));

    if (existing) {
      return res.status(400).json({ message: "Déjà dans les favoris" });
    }

    // Ajouter aux favoris
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, filmId: film.id })
      .returning();

    res.status(201).json({
      id: favorite.id,
      filmId: film.id,
      imdbId: film.imdbId,
      title: film.title,
      poster: film.poster,
      year: film.year,
      createdAt: favorite.createdAt,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout aux favoris" });
  }
};

export const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  const { imdbId } = req.params;

  try {
    // Trouver le film
    const [film] = await db
      .select()
      .from(films)
      .where(eq(films.imdbId, imdbId));

    if (!film) {
      return res.status(404).json({ message: "Film non trouvé" });
    }

    // Supprimer des favoris
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.filmId, film.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: "Favori non trouvé" });
    }

    res.json({ message: "Supprimé des favoris" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
