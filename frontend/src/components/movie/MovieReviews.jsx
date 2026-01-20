import { Star, Send, Trash2, ThumbsUp } from "lucide-react";

export default function MovieReviews({
  userRating,
  hoverRating,
  reviewText,
  reviews,
  onRatingChange,
  onRatingHover,
  onReviewChange,
  onReviewSubmit,
  onDeleteReview,
  onReaction,
  currentUserId,
}) {
  return (
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

      {/* Liste des avis */}
      {reviews.length > 0 && (
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-2 text-sm group">
              <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                <span className="text-[11px]">{r.avatarInitials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{r.username}</span>
                  <span>•</span>
                  <span>{r.timestamp}</span>
                  {r.rating ? (
                    <>
                      <span>•</span>
                      <span className="text-yellow-400">{r.rating}/5</span>
                    </>
                  ) : null}

                  {/* Réaction J'aime (déplacée ici) */}
                  <span>•</span>
                  {(() => {
                    const likes = r.reactions?.like || [];
                    const hasLiked = likes.includes(currentUserId);
                    const count = likes.length;

                    return (
                      <button
                        onClick={() => onReaction(r.id, "like")}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all ${
                          hasLiked
                            ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                        }`}
                        title={`${count} J'aime`}
                      >
                        <ThumbsUp
                          size={11}
                          fill={hasLiked ? "currentColor" : "none"}
                        />
                        {count > 0 && <span className="font-medium">{count}</span>}
                      </button>
                    );
                  })()}
                </div>
                <p className="text-gray-700 dark:text-gray-200">{r.text}</p>
              </div>

              <button
                onClick={() => onDeleteReview(r.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-600/10 rounded text-red-500 dark:text-red-400"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
