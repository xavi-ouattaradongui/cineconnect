import { Star } from "lucide-react";

export default function MovieInfo({ movie }) {
  return (
    <div className="space-y-12">
      {/* SYNOPSIS */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Star size={16} className="text-blue-500" />
          Synopsis
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {movie.Plot}
        </p>
      </section>

      {/* INFOS TECHNIQUES */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4">
          Informations
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Réalisateur</p>
            <p className="text-black dark:text-white font-medium">{movie.Director}</p>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Date de sortie</p>
            <p className="text-black dark:text-white font-medium">{movie.Released}</p>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Genre</p>
            <p className="text-black dark:text-white font-medium">{movie.Genre}</p>
          </div>
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Durée</p>
            <p className="text-black dark:text-white font-medium">{movie.Runtime}</p>
          </div>
        </div>
      </section>

      {/* CAST */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4">
          Acteurs principaux
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {movie.Actors}
        </p>
      </section>
    </div>
  );
}
