import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMovie } from "../hooks/useMovies";

export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: fullMovie } = useMovie(movie.imdbID);

  const handleAddFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link
      to={`/film/${movie.imdbID}`}
      className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-[1.03] transition block group"
    >
      {/* IMAGE + BOUTON FAVORI */}
      <div className="relative">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-72 object-cover"
        />

        {/* BOUTON FAVORI */}
        <button
          onClick={handleAddFavorite}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* NOTE */}
        {fullMovie?.imdbRating && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded">
            {fullMovie.imdbRating}/10
          </div>
        )}
      </div>

      {/* INFOS */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{movie.Title}</h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
      </div>
    </Link>
  );
}
