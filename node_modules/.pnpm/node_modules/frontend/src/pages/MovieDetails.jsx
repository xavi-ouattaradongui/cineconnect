import { useParams } from "@tanstack/react-router";
import { useMovie } from "../hooks/useMovies";
import Loader from "../components/Loader";
import RatingCircle from "../components/RatingCircle";

export default function MovieDetails() {
  const { id } = useParams({ from: "/film/$id" });
  const { data: movie, isLoading, error } = useMovie(id);

  if (isLoading) return <Loader />;
  if (error) return <div className="px-10 py-10 text-red-500">Erreur: {error}</div>;
  if (!movie) return <div className="px-10 py-10">Film non trouvé</div>;

  return (
    <div className="w-full">
      <div className="h-24"></div>

      <div className="px-10 py-10 flex flex-col lg:flex-row gap-10">

        {/* POSTER */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="rounded-xl shadow-xl max-w-sm object-cover"
          />
        </div>

        {/* INFOS */}
        <div className="flex flex-col gap-6 w-full lg:w-2/3">

          {/* TITRE + NOTE */}
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{movie.Title}</h1>
            <RatingCircle rating={parseFloat(movie.imdbRating)} />
          </div>

          {/* INFOS TECH */}
          <div className="text-gray-300 space-y-2">
            <p><span className="font-bold">Genre :</span> {movie.Genre}</p>
            <p><span className="font-bold">Sortie :</span> {movie.Released}</p>
            <p><span className="font-bold">Durée :</span> {movie.Runtime}</p>
            <p><span className="font-bold">Réalisateur :</span> {movie.Director}</p>
            <p><span className="font-bold">Acteurs :</span> {movie.Actors}</p>
          </div>

          {/* SYNOPSIS */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">
              {movie.Plot}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
