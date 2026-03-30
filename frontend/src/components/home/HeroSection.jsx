import { Link } from "@tanstack/react-router";
import { Star, Plus, Check } from "lucide-react";

export default function HeroSection({ 
  heroPicking, 
  fullMovie, 
  isInList, 
  onAddToList 
}) {
  if (heroPicking) {
    return (
      <div className="relative w-full h-[52vh] sm:h-[62vh] lg:h-[70vh] overflow-hidden rounded-b-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />
    );
  }

  if (!fullMovie) {
    return null;
  }

  return (
    <div className="relative w-full h-[52vh] sm:h-[62vh] lg:h-[70vh] overflow-hidden rounded-b-3xl group">
      <img
        src={fullMovie.Poster}
        alt={fullMovie.Title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase">
            À la une
          </span>
          <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
            <Star size={12} fill="currentColor" />
            {fullMovie.imdbRating}
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-3">
          {fullMovie.Title}
        </h1>
        <p className="text-gray-300 text-sm max-w-lg mb-6 leading-relaxed line-clamp-2">
          {fullMovie.Plot}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/film/${fullMovie.imdbID}`}
            className="hover:bg-gray-200 transition-colors flex text-sm font-medium text-black bg-white rounded-lg px-5 py-2.5 items-center gap-2"
          >
            Détails
          </Link>
          <button
            onClick={onAddToList}
            className="bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-lg text-sm font-medium hover:text-blue-500 hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            {isInList(fullMovie.imdbID) ? (
              <>
                <Check size={16} />
                Dans ma liste
              </>
            ) : (
              <>
                <Plus size={16} />
                Ajouter à ma liste
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
