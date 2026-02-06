import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const MyListContext = createContext();

export function MyListProvider({ children }) {
  const { user, token } = useAuth();
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste depuis le backend
  useEffect(() => {
    // Vider immédiatement la liste
    setMyList([]);

    if (user?.id && token) {
      loadMyList();
    }
  }, [user?.id, token]);

  const loadMyList = async () => {
    if (!token) {
      setMyList([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getMyList(token);
      const formattedList = data.map((item) => ({
        imdbID: item.imdbId,
        Title: item.title,
        Poster: item.poster,
        Year: item.year,
      }));
      setMyList(formattedList);
    } catch (error) {
      console.error("Erreur chargement liste:", error);
      setMyList([]);
    } finally {
      setLoading(false);
    }
  };

  const addToList = async (movie) => {
    if (!token) {
      console.error("Vous devez être connecté");
      return;
    }

    const alreadyExists = myList.some((m) => m.imdbID === movie.imdbID);
    if (!alreadyExists) {
      setMyList((prev) => [...prev, movie]);
    }

    try {
      await api.addToMyList(movie, token);
      await loadMyList();
    } catch (error) {
      console.error("Erreur ajout liste:", error);
      if (!alreadyExists) {
        setMyList((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      }
    }
  };

  const removeFromList = async (id) => {
    if (!token) {
      console.error("Vous devez être connecté");
      return;
    }

    const oldList = [...myList];
    setMyList((prev) => prev.filter((m) => m.imdbID !== id));

    try {
      await api.removeFromMyList(id, token);
      await loadMyList();
    } catch (error) {
      console.error("Erreur suppression liste:", error);
      setMyList(oldList);
    }
  };

  const isInList = (id) => {
    return myList.some((m) => m.imdbID === id);
  };

  const providerKey = user?.id ? `mylist-${user.id}` : "mylist-guest";

  return (
    <MyListContext.Provider
      key={providerKey}
      value={{
        myList,
        addToList,
        removeFromList,
        isInList,
        loading,
        refresh: loadMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
}

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList doit être utilisé dans MyListProvider");
  }
  return context;
};
