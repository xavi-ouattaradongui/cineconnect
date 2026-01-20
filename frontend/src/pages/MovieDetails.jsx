import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMovie } from "../hooks/useMovies";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import MovieHero from "../components/movie/MovieHero";
import MovieInfo from "../components/movie/MovieInfo";
import MovieReviews from "../components/movie/MovieReviews";
import ChatWidget from "../components/movie/ChatWidget";

export default function MovieDetails() {
  const { id } = useParams({ from: "/film/$id" });
  const { data: movie, isLoading, error } = useMovie(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();
  const { user } = useAuth();

  // États
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  
  // Avis & Notes - Persistants par utilisateur/film
  const [reviews, setReviews] = useState(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`reviews_${user.id}_${id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [userRating, setUserRating] = useState(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`rating_${user.id}_${id}`);
      return saved ? Number(saved) : null;
    }
    return null;
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // Sauvegarder les avis quand ils changent
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`reviews_${user.id}_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, user?.id, id]);

  // Handlers
  const handleFavorite = () => {
    if (isFavorite(id)) removeFavorite(id);
    else addFavorite(movie);
  };

  const handleAddToList = () => {
    if (isInList(id)) removeFromList(id);
    else addToList(movie);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      userId: user?.id || "anonymous", // ✅ Ajouter userId
      text: messageText,
      username: user?.username || "anonyme",
      timestamp: new Date().toISOString(), // ✅ Format ISO pour API
      avatar: user?.avatar || null,
      avatarInitials:
        user?.displayName?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?",
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");

    // TODO: Remplacer par appel API
    // await fetch(`/api/movies/${id}/chat`, {
    //   method: 'POST',
    //   body: JSON.stringify({ text: messageText })
    // });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    // Vérifier si l'utilisateur a déjà un avis pour ce film
    const existingReviewIndex = reviews.findIndex((r) => r.userId === user?.id);

    if (existingReviewIndex !== -1) {
      // Modifier l'avis existant
      const updatedReviews = [...reviews];
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        text: reviewText,
        rating: userRating || null,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };
      setReviews(updatedReviews);
    } else {
      // Créer un nouvel avis
      setReviews([
        ...reviews,
        {
          id: Date.now(),
          userId: user?.id || "anonymous",
          text: reviewText,
          rating: userRating || null,
          username: user?.username || "anonyme",
          avatar: user?.avatar || null,
          avatarInitials:
            user?.displayName?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?",
          timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          reactions: { like: [] },
        },
      ]);
    }
    setReviewText("");
  };

  const handleDeleteReview = (reviewId) => {
    // Un utilisateur ne peut supprimer que son propre avis
    const review = reviews.find((r) => r.id === reviewId);
    if (review && review.userId === user?.id) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  };

  const handleReaction = (reviewId, reactionKey) => {
    setReviews((prevReviews) =>
      prevReviews.map((r) => {
        if (r.id !== reviewId) return r;

        const reactions = r.reactions || { like: [] };
        const userList = reactions[reactionKey] || [];
        const userId = user?.id || "anonymous";

        if (userList.includes(userId)) {
          return {
            ...r,
            reactions: {
              ...reactions,
              [reactionKey]: userList.filter((id) => id !== userId),
            },
          };
        } else {
          return {
            ...r,
            reactions: {
              ...reactions,
              [reactionKey]: [...userList, userId],
            },
          };
        }
      })
    );
  };

  const handleRatingChange = (value) => {
    setUserRating(value);
    if (user?.id) {
      localStorage.setItem(`rating_${user.id}_${id}`, String(value));
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="px-10 py-10 text-red-500">Erreur: {error}</div>;
  if (!movie) return <div className="px-10 py-10">Film non trouvé</div>;

  return (
    <div className="w-full bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen">
      <div className="h-16"></div>

      {/* HERO */}
      <MovieHero
        movie={movie}
        id={id}
        isFavorite={isFavorite(id)}
        isInList={isInList(id)}
        onFavorite={handleFavorite}
        onAddToList={handleAddToList}
      />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
        <div className="lg:col-span-2 space-y-12">
          <MovieInfo movie={movie} />
          <MovieReviews
            userRating={userRating}
            hoverRating={hoverRating}
            reviewText={reviewText}
            reviews={reviews}
            onRatingChange={handleRatingChange}
            onRatingHover={setHoverRating}
            onReviewChange={(e) => setReviewText(e.target.value)}
            onReviewSubmit={handleSubmitReview}
            onDeleteReview={handleDeleteReview}
            onReaction={handleReaction}
            currentUserId={user?.id || "anonymous"}
          />
        </div>

        {/* SIDEBAR */}
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

      {/* CHAT WIDGET */}
      <ChatWidget
        chatMessages={chatMessages}
        messageText={messageText}
        chatCollapsed={chatCollapsed}
        onSendMessage={handleSendMessage}
        onMessageChange={(e) => setMessageText(e.target.value)}
        onToggleCollapse={() => setChatCollapsed((v) => !v)}
        movieTitle={movie.Title}
        currentUserId={user?.id} // ✅ Passer userId au widget
      />
    </div>
  );
}
