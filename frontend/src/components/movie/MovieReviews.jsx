import { Star, Send, Trash2, ThumbsUp, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function MovieReviews({
  userRating,
  hoverRating,
  reviewText,
  reviews,
  averageRating,
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
        <div className="mt-4 space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-start gap-2 text-sm relative">
              <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-[11px]">{r.avatarInitials}</span>
              </div>
              <div className="flex-1">
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
              {/* Remplacer le bouton supprimer par un menu */}
              {r.userId === currentUserId && (
                <div className="relative">
                  <button
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition"
                    onClick={() =>
                      setOpenMenuId(openMenuId === r.id ? null : r.id)
                    }
                    title="Options"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === r.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded shadow-lg z-10">
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                        onClick={() => {
                          setOpenMenuId(null);
                          if (
                            window.confirm(
                              "Voulez-vous vraiment supprimer ce commentaire ?"
                            )
                          ) {
                            onDeleteReview(r.id);
                          }
                        }}
                      >
                        Supprimer
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10"
                        onClick={() => {
                          setOpenMenuId(null);
                          onReviewChange({ target: { value: r.text } });
                          // Optionnel : focus input, ou ajouter une logique pour modifier
                        }}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
