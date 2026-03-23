import { Link } from "@tanstack/react-router";
import MovieCard from "../shared/MovieCard";

export default function ProfileSection({ 
  title, 
  icon, 
  items, 
  emptyMessage, 
  linkTo, 
  linkText 
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
          {icon}
          {title}
        </h2>
        <Link
          to={linkTo}
          className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          {linkText}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.slice(0, 5).map((m) => (
            <MovieCard key={m.imdbID} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}
