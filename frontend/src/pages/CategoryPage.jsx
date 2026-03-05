import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import Loader from "../components/shared/Loader";
import MovieCard from "../components/shared/MovieCard";
import { useSearchMoviesMultiTerms } from "../hooks/useMovies";
import { getCategorySearchTerms } from "../utils/categorySearch";
import { getCategoryDisplayName } from "../utils/categoryNames";

export default function CategoryPage() {
  const { category } = useParams({ from: "/categorie/$category" });
  const categoryName = category || "";
  const searchTerms = useMemo(
    () => getCategorySearchTerms(categoryName),
    [categoryName]
  );
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [categoryName]);

  const pagesToFetch = useMemo(() => {
    if (visibleCount <= 12) return 2;
    return 2 + Math.ceil((visibleCount - 12) / 10);
  }, [visibleCount]);

  const { data, isLoading, isFetching } = useSearchMoviesMultiTerms(
    searchTerms,
    pagesToFetch
  );
  const movies = data?.Search || [];
  const totalResults = Number(data?.totalResults || 0);
  const visibleMovies = movies.slice(0, visibleCount);
  const shownCount = visibleMovies.length;
  const hasMore = totalResults
    ? visibleCount < totalResults
    : movies.length > visibleCount;

  if (isLoading) return <Loader />;

  return (
    <div className="w-full bg-white dark:bg-black px-10 pt-16 pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {getCategoryDisplayName(categoryName)}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {shownCount} film{shownCount > 1 ? "s" : ""}
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
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 6)}
                disabled={isFetching}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-400 transition-colors disabled:opacity-60"
              >
                {isFetching ? "Chargement..." : "Charger plus"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
