const CATEGORY_SEARCH_TERMS = {
  action: ["Action", "War"],
  comedie: ["Comedy", "Funny"],
  horreur: ["Horror", "Haunted"],
  "sci-fi": ["Sci-Fi", "Space"],
  aventure: ["Adventure", "Quest"],
  romance: ["Romance", "Love"],
  thriller: ["Thriller", "Murder"],
  drame: ["Drama", "Story"],
  animation: ["Animation", "Cartoon"],
  fantasy: ["Fantasy", "Magic"],
  crime: ["Crime", "Detective"],
  western: ["Western", "Cowboy"],
  documentaire: ["Documentary", "Nature"],
  mystere: ["Mystery", "Secret"],
};

const normalizeCategory = (value) => {
  return (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const getCategorySearchTerm = (category) => {
  const normalized = normalizeCategory(category);
  const terms = CATEGORY_SEARCH_TERMS[normalized];
  if (Array.isArray(terms) && terms.length > 0) {
    return terms[0];
  }
  return category || "";
};

export const getCategorySearchTerms = (category) => {
  const normalized = normalizeCategory(category);
  const terms = CATEGORY_SEARCH_TERMS[normalized];
  if (Array.isArray(terms) && terms.length > 0) {
    return terms;
  }
  return category ? [category] : [];
};
