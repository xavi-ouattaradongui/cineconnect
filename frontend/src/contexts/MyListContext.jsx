import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const MyListContext = createContext();

export function MyListProvider({ children }) {
  const { user } = useAuth();
  const [myList, setMyList] = useState([]);

  // Charger la liste au montage ou changement d'utilisateur
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`mylist_${user.id}`);
      setMyList(saved ? JSON.parse(saved) : []);
    } else {
      // Si pas d'utilisateur, vider la liste
      setMyList([]);
    }
  }, [user?.id]);

  // Sauvegarder la liste quand elle change
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`mylist_${user.id}`, JSON.stringify(myList));
    }
  }, [myList, user?.id]);

  const addToList = (movie) => {
    if (!myList.some((m) => m.imdbID === movie.imdbID)) {
      setMyList([...myList, movie]);
    }
  };

  const removeFromList = (id) => {
    setMyList(myList.filter((m) => m.imdbID !== id));
  };

  const isInList = (id) => {
    return myList.some((m) => m.imdbID === id);
  };

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList }}>
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
