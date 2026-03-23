import { Star } from "lucide-react";

export default function MovieInfo({ movie }) {
  const details = [
    { label: "Réalisateur", value: movie.Director || "Inconnu" },
    { label: "Date de sortie", value: movie.Released || "Inconnue" },
    { label: "Genre", value: movie.Genre || "Inconnu" },
    { label: "Durée", value: movie.Runtime || "Inconnue" },
  ];

  return (
    <div className="space-y-12">
      {/* SYNOPSIS */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Star size={16} className="text-blue-500" />
          Synopsis
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {movie.Plot || "Synopsis indisponible."}
        </p>
      </section>

      {/* INFOS TECHNIQUES */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4">
          Informations
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-lg"
            >
              <p className="text-gray-500 text-xs mb-1">{detail.label}</p>
              <p className="text-black dark:text-white font-medium">{detail.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAST */}
      <section>
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4">
          Acteurs principaux
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {movie.Actors || "Distribution indisponible."}
        </p>
      </section>
    </div>
  );
}
