// Mapping des noms de catégories
export const categoryDisplayNames = {
  Action: "Action & Adrénaline",
  Comédie: "Rires garantis",
  Horreur: "Terreur & Mystère",
  "Sci-Fi": "Science-fiction épique",
  Aventure: "Explorations épiques",
  Romance: "Histoires romantiques",
  Thriller: "Suspense haletant",
  Drame: "Drames intenses",
  Animation: "Animation familiale",
  Fantasy: "Univers fantastiques",
  Crime: "Enquêtes criminelles",
  Western: "Far West légendaire",
  Documentaire: "Documentaires captivants",
  Mystere: "Mystères intrigants",
};

// Fonction pour obtenir le nom d'affichage
export const getCategoryDisplayName = (category) => {
  return categoryDisplayNames[category] || category;
};
