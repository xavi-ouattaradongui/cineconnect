import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import Loader from "../components/shared/Loader";
import MovieCard from "../components/shared/MovieCard";
import { useSectionMovies } from "../hooks/useSectionMovies";

const sectionTitles = {
  trending: "Tendances",
  new: "Nouveautés",
  popular: "Les plus vus",
  recommended: "Recommandés pour toi",
  family: "Films familiaux",
  top10: "Top 10",
  mostLiked: "Les plus aimés",
  discover: "À découvrir",
  random: "Suggestion aléatoire",
  international: "Cinéma international",
  actionNonStop: "Action non-stop",
};

export default function ExplorePage() {
  const { section } = useParams({ from: "/explorez/$section" });
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [section]);

  const { data, isLoading } = useSectionMovies(section);
  const movies = data?.Search || [];
  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = movies.length > visibleCount;

  if (isLoading) return <Loader />;

  const sectionTitle = sectionTitles[section] || section;

  return (
    <div className="w-full bg-white dark:bg-black px-10 pt-16 pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {sectionTitle}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {visibleMovies.length} film{visibleMovies.length > 1 ? "s" : ""}
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
        <div className="flex items-center justify-center min-h-[400px] text-gray-600 dark:text-gray-400">
          <p>Aucun film trouvé pour cette section.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + 12)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
              >
                Charger plus
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
