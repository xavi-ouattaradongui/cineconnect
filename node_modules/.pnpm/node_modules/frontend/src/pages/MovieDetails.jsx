import { useParams } from "@tanstack/react-router";
import { useMovie } from "../hooks/useMovies";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { Heart, Plus, Check, ArrowLeft, Star, Share2 } from "lucide-react";
import { useState } from "react";
import Loader from "../components/Loader";

export default function MovieDetails() {
  const { id } = useParams({ from: "/film/$id" });
  const { data: movie, isLoading, error } = useMovie(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);

  if (isLoading) return <Loader />;
  if (error) return <div className="px-10 py-10 text-red-500">Erreur: {error}</div>;
  if (!movie) return <div className="px-10 py-10">Film non trouvé</div>;

  const handleFavorite = () => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(movie);
    }
  };

  const handleAddToList = () => {
    if (isInList(id)) {
      removeFromList(id);
    } else {
      addToList(movie);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim() && rating > 0) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: commentText,
          rating,
          date: new Date().toLocaleDateString("fr-FR"),
          author: "Vous",
        },
      ]);
      setCommentText("");
      setRating(0);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen">
      <div className="h-16"></div>

      {/* HERO SECTION */}
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
                  onClick={handleAddToList}
                  className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  {isInList(id) ? (
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
                  onClick={handleFavorite}
                  className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  title="Ajouter aux favoris"
                >
                  <Heart
                    size={18}
                    fill={isFavorite(id) ? "#ef4444" : "transparent"}
                    className={isFavorite(id) ? "text-red-500" : "text-gray-400"}
                  />
                </button>
                <button
                  className="p-3 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all"
                  title="Partager"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: movie.Title,
                        text: movie.Plot,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 size={18} />
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
              <span className="text-xs text-gray-400 font-medium">IMDb</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* SYNOPSIS */}
          <section>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star size={16} className="text-blue-500" />
              Synopsis
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {movie.Plot}
            </p>
          </section>

          {/* INFOS TECHNIQUES */}
          <section>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
              Informations
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Réalisateur</p>
                <p className="text-white font-medium">{movie.Director}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Date de sortie</p>
                <p className="text-white font-medium">{movie.Released}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Genre</p>
                <p className="text-white font-medium">{movie.Genre}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p className="text-gray-500 text-xs mb-1">Durée</p>
                <p className="text-white font-medium">{movie.Runtime}</p>
              </div>
            </div>
          </section>

          {/* CAST */}
          <section>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
              Acteurs principaux
            </h3>
            <p className="text-gray-400 text-sm">
              {movie.Actors}
            </p>
          </section>

          {/* COMMENTAIRES */}
          <section>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">
              Commentaires ({comments.length})
            </h3>

            {/* FORMULAIRE */}
            <form onSubmit={handleAddComment} className="mb-8 bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-3">Votre avis</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrivez votre commentaire..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                rows="4"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || rating === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Publier
              </button>
            </form>

            {/* LISTE DES COMMENTAIRES */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= comment.rating ? "text-yellow-400" : "text-gray-600"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Aucun commentaire. Soyez le premier!</p>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">
              À propos
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p><span className="text-white font-medium">Note IMDB:</span> {movie.imdbRating}/10</p>
              <p><span className="text-white font-medium">Année:</span> {movie.Year}</p>
              <p><span className="text-white font-medium">Pays:</span> {movie.Country || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
