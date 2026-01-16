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
    <Link to={`/film/${movie.imdbID}`} className="block group">
      {/* IMAGE AVEC CADRE */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 mb-3">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-72 object-cover group-hover:scale-110 transition duration-300"
        />

        {/* OVERLAY SOMBRE AU HOVER */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300"></div>

        {/* BOUTON FAVORI - VISIBLE AU HOVER */}
        <button
          onClick={handleAddFavorite}
          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition opacity-0 group-hover:opacity-100"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* NOTE */}
        {fullMovie?.imdbRating && (
          <div className="absolute bottom-2 left-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition">
            {fullMovie.imdbRating}
          </div>
        )}
      </div>

      {/* INFOS SANS CADRE */}
      <div>
        <h3 className="text-lg font-semibold group-hover:text-red-600 transition">
          {movie.Title}
        </h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
        {fullMovie?.Genre && (
          <p className="text-xs text-gray-500 mt-1">{fullMovie.Genre}</p>
        )}
      </div>
    </Link>
  );
}
