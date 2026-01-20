import { Heart, Plus, Check, ArrowLeft } from "lucide-react";

export default function MovieHero({ 
  movie, 
  id, 
  isFavorite, 
  isInList, 
  onFavorite, 
  onAddToList 
}) {
  return (
    <div className="relative w-full h-[60vh] lg:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      </div>

      <div className="absolute inset-0 max-w-7xl mx-auto px-6 pt-20 flex flex-col justify-end pb-12">
        {/* BACK BUTTON */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-28 flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors group mb-8 w-fit"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="flex flex-col md:flex-row items-end gap-8">
          {/* POSTER */}
          <div className="hidden md:block w-56 aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 shrink-0">
            <img src={movie.Poster} className="w-full h-full object-cover" alt={movie.Title} />
          </div>

          {/* INFO */}
          <div className="flex-1 w-full space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                {movie.Genre && (
                  <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    {movie.Genre.split(",")[0]}
                  </span>
                )}
                <span>{movie.Year}</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                <span>{movie.Runtime}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                {movie.Title}
              </h1>
              <p className="text-lg text-gray-400 italic font-light">{movie.Plot.substring(0, 100)}...</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center flex-wrap gap-3 pt-2">
              <button
                onClick={onAddToList}
                className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                {isInList ? (
                  <>
                    <Check size={18} />
                    Dans ma liste
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Ma liste
                  </>
                )}
              </button>
              <button
                onClick={onFavorite}
                className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                title="Ajouter aux favoris"
              >
                <Heart
                  size={18}
                  fill={isFavorite ? "#ef4444" : "transparent"}
                  className={isFavorite ? "text-red-500" : "text-gray-400"}
                />
              </button>
            </div>
          </div>

          {/* RATING CIRCLE */}
          <div className="hidden lg:flex flex-col items-center gap-2 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/10" />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={`${(parseFloat(movie.imdbRating) / 10) * 220}`}
                  strokeDashoffset="0"
                  className="text-green-500"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-white">{movie.imdbRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
