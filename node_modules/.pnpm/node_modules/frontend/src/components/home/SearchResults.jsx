import { useSearchMovies } from "../../hooks/useMovies";
import MovieCard from "../MovieCard";
import Loader from "../Loader";

export default function SearchResults({ query }) {
  const { data, isLoading } = useSearchMovies(query);
  const movies = data?.Search || [];

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {movies.length > 0 ? (
        movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-sm">Aucun film trouvé pour "{query}".</p>
      )}
    </div>
  );
}
