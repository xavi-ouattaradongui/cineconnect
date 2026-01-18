import { createContext, useContext, useState, useEffect } from "react";

const MyListContext = createContext();

export function MyListProvider({ children }) {
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem("myList");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

  const addToList = (movie) => {
    setMyList((prev) => [...prev, movie]);
  };

  const removeFromList = (imdbID) => {
    setMyList((prev) => prev.filter((m) => m.imdbID !== imdbID));
  };

  const isInList = (imdbID) => {
    return myList.some((m) => m.imdbID === imdbID);
  };

  return (
    <MyListContext.Provider value={{ myList, addToList, removeFromList, isInList }}>
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within MyListProvider");
  }
  return context;
}
