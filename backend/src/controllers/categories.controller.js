import { db } from "../db/index.js";
import { categories } from "../db/schema/categories.js";

const DEFAULT_CATEGORIES = [
  "Action",
  "Comédie",
  "Horreur",
  "Sci-Fi",
  "Aventure",
  "Romance",
  "Thriller",
  "Drame",
  "Animation",
  "Fantasy",
  "Crime",
  "Western",
  "Documentaire",
  "Mystere",
];

export const getCategories = async (req, res) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Nom de catégorie requis" });
  }

  try {
    const [category] = await db
      .insert(categories)
      .values({ name })
      .onConflictDoNothing()
      .returning();

    if (!category) {
      return res.status(400).json({ message: "Catégorie déjà existante" });
    }

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la catégorie" });
  }
};

export const initializeCategories = async (req, res) => {
  try {
    const createdCategories = [];
    
    for (const categoryName of DEFAULT_CATEGORIES) {
      const [category] = await db
        .insert(categories)
        .values({ name: categoryName })
        .onConflictDoNothing()
        .returning();

      if (category) {
        createdCategories.push(category);
      }
    }

    res.status(201).json({
      message: `${createdCategories.length} catégories créées`,
      categories: createdCategories
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'initialisation des catégories" });
  }
};
