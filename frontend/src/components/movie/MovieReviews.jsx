import { Star, Send, Trash2, Heart, ThumbsDown, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function MovieReviews({
  userRating,
  hoverRating,
  reviewText,
  reviews,
  averageRating,
  isLoading,
  isSubmitting,
  onRatingChange,
  onRatingHover,
  onReviewChange,
  onReviewSubmit,
  onDeleteReview,
  onReaction,
  currentUserId,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Star size={16} className="text-yellow-400" />
          Noter et commenter
        </h3>

        {averageRating && (
          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-3 py-1.5 rounded-full">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              {averageRating}/5
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({reviews.filter((r) => r.rating).length} avis)
            </span>
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onMouseEnter={() => onRatingHover(value)}
            onMouseLeave={() => onRatingHover(0)}
            onClick={() => onRatingChange(value)}
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
      <form onSubmit={onReviewSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={reviewText}
            onChange={onReviewChange}
            placeholder="Écrivez votre avis..."
            disabled={isSubmitting}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!userRating || isSubmitting}
            className="absolute right-1.5 top-1.5 p-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-md transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Envoyer"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-600">
          {isSubmitting
            ? "Envoi en cours..."
            : "Une note est obligatoire. Le commentaire est optionnel."}
        </p>
      </form>

      {/* Liste des avis */}
      {isLoading ? (
        <div className="mt-4 text-center text-gray-500">Chargement des avis...</div>
      ) : reviews.length > 0 ? (
        <div className="mt-4 space-y-3">
          {reviews.map((r) => {
            const canDelete = r.userId === currentUserId;
            const hasLiked = r.reactions?.likedBy?.includes(currentUserId);
            const hasDisliked = r.reactions?.dislikedBy?.includes(currentUserId);
            
            return (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
                    {r.user?.username?.slice(0, 2).toUpperCase() || "??"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{r.user?.username || "Anonyme"}</span>
                    <span>•</span>
                    <span>{new Date(r.createdAt).toLocaleString("fr-FR")}</span>
                    {r.rating && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={12} className="fill-yellow-500" />
                          {r.rating}/5
                        </span>
                      </>
                    )}
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                      {r.comment}
                    </p>
                  )}
                  
                  {/* Boutons de réaction */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => onReaction(r.id, "like")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition ${
                        hasLiked
                          ? "bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400"
                          : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
                      }`}
                      title="J'aime"
                    >
                      <Heart size={14} className={hasLiked ? "fill-current" : ""} />
                      <span>{r.reactions?.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => onReaction(r.id, "dislike")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition ${
                        hasDisliked
                          ? "bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-gray-300"
                          : "hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
                      }`}
                      title="Pas utile"
                    >
                      <ThumbsDown size={14} className={hasDisliked ? "fill-current" : ""} />
                      <span>{r.reactions?.dislikes || 0}</span>
                    </button>
                  </div>
                </div>
                {canDelete && (
                  <div className="relative flex-shrink-0">
                    <button
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition text-gray-600 dark:text-gray-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === r.id ? null : r.id);
                      }}
                      title="Options"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === r.id && (
                      <>
                        {/* Overlay pour fermer le menu en cliquant ailleurs */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-8 w-40 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                          <button
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-white/10 text-red-600 dark:text-red-400 font-medium flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteReview(r.id);
                            }}
                          >
                            <Trash2 size={16} />
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm py-8">
          Aucun avis pour le moment. Soyez le premier ! 🎬
        </div>
      )}
    </section>
  );
}
