import { Link, useParams } from "@tanstack/react-router";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import { useSearchMovies } from "../hooks/useMovies";

export default function CategoryPage() {
  const { category } = useParams({ from: "/categorie/$category" });
  const categoryName = category || "";

  const { data, isLoading } = useSearchMovies(categoryName);
  const movies = data?.Search || [];

  if (isLoading) return <Loader />;

  return (
    <div className="w-full bg-white dark:bg-black px-10 pt-16 pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {categoryName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {movies.length} film{movies.length > 1 ? "s" : ""}
          </p>
        </div>

        <Link
          to="/home"
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Retour
        </Link>
      </div>

      {movies.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Aucun film trouve pour cette categorie.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
