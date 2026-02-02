import { useParams } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useMovie } from "../hooks/useMovies";
import { useReviews } from "../hooks/useReviews";
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
  const { reviews, isLoading: reviewsLoading, createReview, updateReview, deleteReview } = useReviews(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();
  const { user } = useAuth();

  // États
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // Trouver la review de l'utilisateur connecté
  const userReview = useMemo(() => {
    return reviews.find((r) => r.userId === user?.id);
  }, [reviews, user?.id]);

  // Calculer la moyenne des notes
  const averageRating = useMemo(() => {
    const reviewsWithRating = reviews.filter((r) => r.rating !== null);
    if (reviewsWithRating.length === 0) return null;
    const sum = reviewsWithRating.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsWithRating.length).toFixed(1);
  }, [reviews]);

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userRating) {
      alert("Veuillez d'abord donner une note");
      return;
    }

    try {
      if (userReview) {
        await updateReview.mutateAsync({
          reviewId: userReview.id,
          rating: userRating,
          comment: reviewText.trim() || userReview.comment,
        });
      } else {
        await createReview.mutateAsync({
          rating: userRating,
          comment: reviewText.trim() || "",
          // Passer les données du film pour créer l'entrée dans la table films
          title: movie.Title,
          poster: movie.Poster,
          year: parseInt(movie.Year),
        });
      }
      setReviewText("");
      setUserRating(null);
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      alert(err.message || "Erreur lors de l'envoi de l'avis");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
      try {
        await deleteReview.mutateAsync(reviewId);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const handleRatingChange = (value) => {
    setUserRating(value);
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
            userRating={userRating || userReview?.rating}
            hoverRating={hoverRating}
            reviewText={reviewText}
            reviews={reviews}
            averageRating={averageRating}
            isLoading={reviewsLoading}
            onRatingChange={handleRatingChange}
            onRatingHover={setHoverRating}
            onReviewChange={(e) => setReviewText(e.target.value)}
            onReviewSubmit={handleSubmitReview}
            onDeleteReview={handleDeleteReview}
            currentUserId={user?.id} // Assurez-vous que c'est bien un nombre
            isSubmitting={createReview.isPending || updateReview.isPending}
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
