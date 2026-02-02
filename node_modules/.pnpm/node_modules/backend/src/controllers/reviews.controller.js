import { db } from "../db/index.js";
import { reviews } from "../db/schema/reviews.js";
import { eq } from "drizzle-orm";

export const createReview = async (req, res) => {
  const { rating, comment, filmId } = req.body;
  const userId = req.user.id;

  if (!rating || !filmId) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const [review] = await db
      .insert(reviews)
      .values({ rating, comment, filmId, userId })
      .returning();

    res.status(201).json(review);
  } catch {
    res.status(400).json({ message: "Review déjà existante" });
  }
};

export const getReviewsByFilm = async (req, res) => {
  const { filmId } = req.params;

  const data = await db
    .select()
    .from(reviews)
    .where(eq(reviews.filmId, filmId));

  res.json(data);
};
