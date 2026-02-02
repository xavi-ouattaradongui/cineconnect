import { db } from "../db/index.js";
import { reviews } from "../db/schema/reviews.js";
import { users } from "../db/schema/users.js";
import { films } from "../db/schema/films.js";
import { eq } from "drizzle-orm";

export const createReview = async (req, res) => {
  const { rating, comment, filmId: imdbId } = req.body;
  const userId = req.user.id;

  if (!rating || !imdbId) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // 1. Trouver ou créer le film dans la DB
    let [film] = await db
      .select()
      .from(films)
      .where(eq(films.imdbId, imdbId));

    if (!film) {
      // Si le film n'existe pas, le créer (vous devrez passer plus de données depuis le frontend)
      [film] = await db
        .insert(films)
        .values({
          imdbId: imdbId,
          title: req.body.title || "Unknown",
          poster: req.body.poster || null,
          year: req.body.year || null,
        })
        .returning();
    }

    // 2. Créer la review directement (plus de vérification d'existence)
    const [review] = await db
      .insert(reviews)
      .values({ rating, comment, filmId: film.id, userId })
      .returning();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getReviewsByFilm = async (req, res) => {
  const { filmId: imdbId } = req.params;

  try {
    // 1. Trouver le film par son IMDB ID
    const [film] = await db
      .select()
      .from(films)
      .where(eq(films.imdbId, imdbId));

    if (!film) {
      return res.json([]); // Aucune review si le film n'existe pas encore
    }

    // 2. Récupérer les reviews
    const data = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        filmId: reviews.filmId,
        userId: reviews.userId,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.filmId, film.id));

    res.json(data);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const [existing] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));

    if (!existing) {
      return res.status(404).json({ message: "Review introuvable" });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const [updated] = await db
      .update(reviews)
      .set({ rating, comment })
      .where(eq(reviews.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [existing] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));

    if (!existing) {
      return res.status(404).json({ message: "Review introuvable" });
    }

    if (existing.userId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await db.delete(reviews).where(eq(reviews.id, id));

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
