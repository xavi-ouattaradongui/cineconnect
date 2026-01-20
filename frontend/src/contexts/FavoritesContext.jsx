import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris au montage ou changement d'utilisateur
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`favorites_${user.id}`);
      setFavorites(saved ? JSON.parse(saved) : []);
    } else {
      // Si pas d'utilisateur, vider les favoris
      setFavorites([]);
    }
  }, [user?.id]);

  // Sauvegarder les favoris quand ils changent
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user?.id]);

  const addFavorite = (movie) => {
    if (!favorites.some((m) => m.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((m) => m.imdbID !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((m) => m.imdbID === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  }
  return context;
};
