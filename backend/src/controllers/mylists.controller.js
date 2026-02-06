import { db } from "../db/index.js";
import { mylists } from "../db/schema/mylists.js";
import { films } from "../db/schema/films.js";
import { eq, and, desc } from "drizzle-orm";

export const getMyList = async (req, res) => {
  const userId = req.user.id;

  try {
    const userList = await db
      .select({
        id: mylists.id,
        filmId: films.id,
        imdbId: films.imdbId,
        title: films.title,
        poster: films.poster,
        year: films.year,
        createdAt: mylists.createdAt,
      })
      .from(mylists)
      .innerJoin(films, eq(mylists.filmId, films.id))
      .where(eq(mylists.userId, userId))
      .orderBy(desc(mylists.createdAt));

    res.json(userList);
  } catch (error) {
    console.error("Error getting my list:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de la liste" });
  }
};

export const addToMyList = async (req, res) => {
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

    // Vérifier si déjà dans la liste
    const [existing] = await db
      .select()
      .from(mylists)
      .where(and(eq(mylists.userId, userId), eq(mylists.filmId, film.id)));

    if (existing) {
      return res.status(400).json({ message: "Déjà dans votre liste" });
    }

    // Ajouter à la liste
    const [listItem] = await db
      .insert(mylists)
      .values({ userId, filmId: film.id })
      .returning();

    res.status(201).json({
      id: listItem.id,
      filmId: film.id,
      imdbId: film.imdbId,
      title: film.title,
      poster: film.poster,
      year: film.year,
      createdAt: listItem.createdAt,
    });
  } catch (error) {
    console.error("Error adding to my list:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout à la liste" });
  }
};

export const removeFromMyList = async (req, res) => {
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

    // Supprimer de la liste
    const result = await db
      .delete(mylists)
      .where(and(eq(mylists.userId, userId), eq(mylists.filmId, film.id)))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: "Film non trouvé dans votre liste" });
    }

    res.json({ message: "Supprimé de votre liste" });
  } catch (error) {
    console.error("Error removing from my list:", error);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};
