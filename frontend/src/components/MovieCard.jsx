import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Check, Heart } from "lucide-react";
import { useMovie } from "../hooks/useMovies";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";

export default function MovieCard({ movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();

  const { data: fullMovie } = useMovie(movie.imdbID);

  const handleAddToList = (e) => {
    e.preventDefault();
    if (isInList(movie.imdbID)) {
      removeFromList(movie.imdbID);
    } else {
      addToList(movie);
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const getRatingColor = (rating) => {
    const rate = parseFloat(rating);
    if (rate >= 8)
      return "bg-green-400/10 text-green-400 border-green-400/20";
    if (rate >= 7)
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    return "bg-red-400/10 text-red-400 border-red-400/20";
  };

  return (
    <Link
      to={`/film/${movie.imdbID}`}
      className="group relative flex flex-col gap-3"
    >
      {/* IMAGE AVEC CADRE */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-200 dark:bg-zinc-900 border border-gray-300 dark:border-white/5">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-white/0 dark:bg-black/0 group-hover:bg-white/20 dark:group-hover:bg-black/20 transition-colors duration-300"></div>

        {/* BOUTON FAVORIS */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 left-2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-gray-600 dark:text-white/50 hover:text-red-500 hover:bg-white dark:hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 duration-300"
          title="Ajouter aux favoris"
        >
          <Heart
            size={16}
            fill={isFavorite(movie.imdbID) ? "#ef4444" : "transparent"}
            className={isFavorite(movie.imdbID) ? "text-red-500" : ""}
          />
        </button>

        {/* BOUTON AJOUTER À LA LISTE */}
        <button
          onClick={handleAddToList}
          className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-gray-600 dark:text-white/50 hover:text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
          title="Ajouter à ma liste"
        >
          {isInList(movie.imdbID) ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* INFOS */}
      <div>
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-sm font-medium text-black dark:text-white truncate group-hover:text-red-400 transition-colors">
            {movie.Title}
          </h3>
          {fullMovie?.imdbRating && (
            <span
              className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${getRatingColor(
                fullMovie.imdbRating
              )}`}
            >
              {fullMovie.imdbRating}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{movie.Year}</span>
          {fullMovie?.Genre && (
            <span>{fullMovie.Genre.split(",")[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

