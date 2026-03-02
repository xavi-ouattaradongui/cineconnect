import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {movies.map((m) => (
        <MovieCard key={m.imdbID} movie={m} />
      ))}
    </div>
  );
}
