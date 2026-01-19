import { useParams } from "@tanstack/react-router";
import { useMovie } from "../hooks/useMovies";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Heart,
  Plus,
  Check,
  ArrowLeft,
  Star,
  Share2,
  Send,
  Skull,
  Ghost,
  Zap,
  Flame,
  Crown,
  Swords,
  Sparkles,
  Moon,
  Sun,
  Camera,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Loader from "../components/Loader";

// Mapping des icônes d’avatar (cohérent avec le profil)
const AVATAR_ICONS = {
  skull: Skull,
  ghost: Ghost,
  zap: Zap,
  heart: Heart,
  star: Star,
  flame: Flame,
  crown: Crown,
  swords: Swords,
  sparkles: Sparkles,
  moon: Moon,
  sun: Sun,
  camera: Camera,
};

// Petit composant Avatar
function AvatarBubble({ avatar, initials, size = 24 }) {
  const Icon = AVATAR_ICONS[avatar];
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/80 shrink-0"
      style={{ width: size, height: size }}
      title={initials}
    >
      {Icon ? (
        <Icon size={Math.max(12, Math.floor(size * 0.6))} />
      ) : (
        <span className="text-[10px] leading-none">{initials || "?"}</span>
      )}
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams({ from: "/film/$id" });
  const { data: movie, isLoading, error } = useMovie(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState([]); // remplace 'messages'
  const [messageText, setMessageText] = useState("");
  const [reviews, setReviews] = useState([]); // nouveau: avis/notes
  const [userRating, setUserRating] = useState(() => {
    const saved = localStorage.getItem(`rating-${id}`);
    return saved ? Number(saved) : null;
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const chatEndRef = useRef(null); // remplace messagesEndRef

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: Date.now(),
        text: messageText,
        author: "Vous",
        username: user?.username || "anonyme",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        avatar: user?.avatar || null,
        avatarInitials:
          user?.displayName?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?",
        isOwn: true,
      },
    ]);
    setMessageText("");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([
      ...reviews,
      {
        id: Date.now(),
        text: reviewText,
        rating: userRating || null,
        username: user?.username || "anonyme",
        avatar: user?.avatar || null,
        avatarInitials:
          user?.displayName?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setReviewText("");
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="px-10 py-10 text-red-500">Erreur: {error}</div>;
  if (!movie) return <div className="px-10 py-10">Film non trouvé</div>;

  return (
    <div className="w-full bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
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
              <span className="text-xs text-gray-400 font-medium"></span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
        <div className="lg:col-span-2 space-y-12">
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

          {/* NOTER + COMMENTER (fusion) */}
          <section>
            <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              Noter et commenter
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => {
                    setUserRating(value);
                    localStorage.setItem(`rating-${id}`, String(value));
                  }}
                  className="p-1"
                  title={`${value}/5`}
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      (hoverRating || userRating) >= value
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {userRating ? `${userRating}/5` : "Pas encore noté"}
              </span>
            </div>

            {/* Comment input */}
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Écrivez votre avis..."
                  className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition"
                />
                <button
                  type="submit"
                  disabled={!reviewText.trim()}
                  className="absolute right-1.5 top-1.5 p-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Envoyer"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-600">
                Votre note est enregistrée localement sur cet appareil.
              </p>
            </form>

            {/* Optionnel: afficher la liste des avis locaux */}
            {reviews.length > 0 && (
              <div className="mt-4 space-y-2">
                {reviews.map((r) => (
                  <div key={r.id} className="flex items-start gap-2 text-sm">
                    <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[11px]">{r.avatarInitials}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{r.username}</span>
                        <span>•</span>
                        <span>{r.timestamp}</span>
                        {r.rating ? (
                          <>
                            <span>•</span>
                            <span className="text-yellow-400">{r.rating}/5</span>
                          </>
                        ) : null}
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest mb-4">
              À propos
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="text-black dark:text-white font-medium">Note:</span> {movie.imdbRating}/10</p>
              <p><span className="text-black dark:text-white font-medium">Année:</span> {movie.Year}</p>
              <p><span className="text-black dark:text-white font-medium">Pays:</span> {movie.Country || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* WIDGET DISCUSSION DE GROUPE (flottant) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div className="mb-0 w-80 bg-white dark:bg-[#16191D] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">Discussion de groupe</span>
            </div>
            <div className="flex gap-2 text-gray-500 dark:text-gray-400">
              <button
                type="button"
                onClick={() => setChatCollapsed((v) => !v)}
                className="px-1 rounded hover:bg-gray-200/60 dark:hover:bg-white/10 text-xs font-medium"
                title={chatCollapsed ? "Développer" : "Réduire"}
                aria-label={chatCollapsed ? "Développer le chat" : "Réduire le chat"}
              >
                •••
              </button>
            </div>
          </div>

          {/* Messages */}
          {!chatCollapsed && (
            <div className="h-64 p-3 overflow-y-auto space-y-3 bg-white dark:bg-[#0f1114]">
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Aucun message pour le moment</p>
                </div>
              ) : (
                chatMessages.map((msg) =>
                  msg.isOwn ? (
                    <div key={msg.id} className="flex gap-2 flex-row-reverse items-start">
                      <AvatarBubble avatar={msg.avatar} initials={msg.avatarInitials} size={24} />
                      <div className="bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/20 p-2 rounded-lg rounded-tr-none max-w-[80%]">
                        <p className="text-[11px] text-indigo-700 dark:text-indigo-100">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex gap-2 items-start">
                      <AvatarBubble avatar={msg.avatar} initials={msg.avatarInitials} size={24} />
                      <div className="bg-gray-100 dark:bg-white/5 p-2 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-[11px] text-gray-700 dark:text-slate-300">{msg.text}</p>
                      </div>
                    </div>
                  )
                )
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input */}
          {!chatCollapsed && (
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#16191D] border-t border-gray-200 dark:border-white/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrire un message..."
                  className="w-full bg-gray-100 dark:bg-black/20 text-black dark:text-white text-xs px-3 py-2 rounded-md border border-gray-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-0 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-400"
                />
                <button
                  className="absolute right-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors disabled:opacity-40"
                  disabled={!messageText.trim()}
                  title="Envoyer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
