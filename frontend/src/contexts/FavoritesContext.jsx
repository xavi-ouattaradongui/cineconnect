import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import { filterUsableMovies, normalizeMovieData } from "../api/omdb";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les favoris depuis le backend
  useEffect(() => {
    // Vider immédiatement les favoris
    setFavorites([]);

    if (user?.id && token) {
      loadFavorites();
    }
  }, [user?.id, token]);

  const loadFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getFavorites(token);
      const formattedFavorites = filterUsableMovies(
        data.map((fav) =>
          normalizeMovieData({
            imdbID: fav.imdbId,
            Title: fav.title,
            Poster: fav.poster,
            Year: fav.year,
          })
        )
      );
      setFavorites(formattedFavorites);
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (movie) => {
    if (!token) {
      console.error("Vous devez être connecté");
      return;
    }

    const alreadyExists = favorites.some((m) => m.imdbID === movie.imdbID);
    if (!alreadyExists) {
      setFavorites((prev) => filterUsableMovies([...prev, normalizeMovieData(movie)]));
    }

    try {
      await api.addFavorite(movie, token);
      // Recharger pour avoir les données fraîches du backend
      await loadFavorites();
    } catch (error) {
      console.error("Erreur ajout favori:", error);
      if (!alreadyExists) {
        setFavorites((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      }
    }
  };

  const removeFavorite = async (id) => {
    if (!token) {
      console.error("Vous devez être connecté");
      return;
    }

    const oldFavorites = [...favorites];
    setFavorites((prev) => prev.filter((m) => m.imdbID !== id));

    try {
      await api.removeFavorite(id, token);
      // Recharger pour avoir les données fraîches du backend
      await loadFavorites();
    } catch (error) {
      console.error("Erreur suppression favori:", error);
      setFavorites(oldFavorites);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((m) => m.imdbID === id);
  };

  // Utiliser user.id comme clé pour forcer un re-mount complet
  const providerKey = user?.id ? `favorites-${user.id}` : "favorites-guest";

  return (
    <FavoritesContext.Provider
      key={providerKey}
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        refresh: loadFavorites,
      }}
    >
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
