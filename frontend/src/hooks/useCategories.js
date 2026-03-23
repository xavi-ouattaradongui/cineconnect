import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

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

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await api.getCategories();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((cat) => cat.name);
      }
      return DEFAULT_CATEGORIES;
    },
    staleTime: 1000 * 60 * 5, 
  });
};
