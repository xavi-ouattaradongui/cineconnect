import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <div className="h-16" />
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-red-500" />
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Favoris
            </h1>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {favorites.length} film{favorites.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 p-6 bg-gray-100 dark:bg-white/5 rounded-full">
              <Heart size={40} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Aucun favori
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Ajoutez des films à vos favoris pour les retrouver rapidement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {favorites.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
