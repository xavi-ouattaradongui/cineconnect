import { useFavorites } from "../contexts/FavoritesContext";
import MovieCard from "../components/MovieCard";
import { Heart } from "lucide-react";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="h-16" />
      <main className="max-w-7xl mx-auto pt-12 px-6 pb-16">
        {favorites.length > 0 && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>
            <p className="text-gray-400">
              {favorites.length} film{favorites.length > 1 ? "s" : ""} dans vos
              favoris
            </p>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-600 text-sm flex items-center gap-1">
              Aucun film favori pour le moment. Cliquez sur le
              <Heart
                size={16}
                fill="#ef4444"
                className="text-red-500"
              />{" "}
              pour ajouter des films à vos favoris.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
