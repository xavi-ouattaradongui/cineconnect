import { Link } from "@tanstack/react-router";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/film/${movie.imdbID}`}
      className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-[1.03] transition block"
    >
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full h-72 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold">{movie.Title}</h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
      </div>
    </Link>
  );
}
