import { useParams } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../services/api";
import { useMovie } from "../hooks/useMovies";
import { useReviews } from "../hooks/useReviews";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/Loader";
import MovieHero from "../components/movie/MovieHero";
import MovieInfo from "../components/movie/MovieInfo";
import MovieReviews from "../components/movie/MovieReviews";
import ChatWidget from "../components/movie/ChatWidget";

export default function MovieDetails() {
  const { id } = useParams({ from: "/film/$id" });
  const { data: movie, isLoading, error } = useMovie(id);
  const { reviews, isLoading: reviewsLoading, createReview, updateReview, deleteReview, toggleReaction } = useReviews(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToList, removeFromList, isInList } = useMyList();
  const { user, token } = useAuth();

  // États
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [lastSeenAt, setLastSeenAt] = useState(null);

  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [chatCollapsed, setChatCollapsed] = useState(false);

  const socketRef = useRef(null);

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

  // Effet pour charger les messages et la date de consultation
  useEffect(() => {
    let active = true;

    const loadMessages = async () => {
      try {
        const data = await api.getMessagesByFilm(id, token);
        if (!active) return;
        setChatMessages(
          data.messages.map((m) => ({
            id: m.id,
            userId: m.userId,
            text: m.content,
            createdAt: m.createdAt,
            deletedAt: m.deletedAt || null,
            username: m.username,
            displayName: m.displayName,
            avatar: m.avatar,
            avatarInitials:
              (m.displayName || m.username || "?")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
            replyTo: m.replyTo || null,
          }))
        );
        setLastSeenAt(data.lastSeenAt || null);
      } catch (err) {
        console.error("Erreur chargement messages:", err);
      }
    };

    loadMessages();
    return () => { active = false; };
  }, [id, token]);

  // Effet pour mettre à jour la date de consultation à chaque ouverture du chat
  useEffect(() => {
    if (!chatCollapsed && user?.id && token) {
      api.updateChatSeen(id, token)
        .then(res => setLastSeenAt(res.lastSeenAt))
        .catch(() => {});
    }
  }, [chatCollapsed, id, user?.id, token]);

  // Connexion au socket
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinFilm", { imdbId: id });
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });

    const handleReceive = (m) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: m.id,
          userId: m.userId,
          text: m.content,
          createdAt: m.createdAt,
          deletedAt: m.deletedAt || null,
          username: m.username,
          displayName: m.displayName,
          avatar: m.avatar,
          avatarInitials:
            (m.displayName || m.username || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          replyTo: m.replyTo || null,
        },
      ]);
    };

    // Toujours soft delete : on ne retire jamais le message du chat
    const handleDeleted = ({ id: deletedId }) => {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === deletedId
            ? { ...m, text: "Message supprimé", content: "Message supprimé", deletedAt: new Date().toISOString() }
            : m
        )
      );
    };

    const handleReplyDetached = ({ replyToId, messageIds }) => {
      if (!messageIds?.length) return;
      setChatMessages((prev) =>
        prev.map((m) =>
          messageIds.includes(m.id)
            ? { ...m, replyTo: { id: replyToId, content: "Message supprimé", deleted: true } }
            : m
        )
      );
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("messageDeleted", handleDeleted);
    socket.on("messageReplyDetached", handleReplyDetached);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageDeleted", handleDeleted);
      socket.off("messageReplyDetached", handleReplyDetached);
      socket.disconnect();
    };
  }, [id]);

  // Handlers
  const handleFavorite = () => {
    if (isFavorite(id)) removeFavorite(id);
    else addFavorite(movie);
  };

  const handleAddToList = () => {
    if (isInList(id)) removeFromList(id);
    else addToList(movie);
  };

  const handleSendMessage = async (e, replyTo) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    if (!user?.id) {
      alert("Connectez-vous pour envoyer un message");
      return;
    }

    const payload = {
      content: messageText.trim(),
      imdbId: id,
      userId: user.id,
      title: movie.Title,
      poster: movie.Poster,
      year: parseInt(movie.Year),
      replyToId: replyTo?.id || null,
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", payload);
      setMessageText("");
      return;
    }

    try {
      const saved = await api.createMessage(
        id,
        {
          content: payload.content,
          title: payload.title,
          poster: payload.poster,
          year: payload.year,
          replyToId: payload.replyToId,
        },
        token
      );
      setChatMessages((prev) => [
        ...prev,
        {
          id: saved.id,
          userId: saved.userId,
          text: saved.content,
          createdAt: saved.createdAt,
          username: saved.username,
          displayName: saved.displayName,
          avatar: saved.avatar,
          avatarInitials:
            (saved.displayName || saved.username || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
          replyTo: saved.replyTo || null,
        },
      ]);
      setMessageText("");
    } catch (err) {
      console.error("Erreur envoi message:", err);
      alert(err.message || "Erreur lors de l'envoi");
    }
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

  const handleReaction = async (reviewId, type) => {
    try {
      await toggleReaction.mutateAsync({ reviewId, type });
    } catch (err) {
      console.error("Erreur lors de la réaction:", err);
    }
  };

  const handleRatingChange = (value) => {
    setUserRating(value);
  };

  const handleDeleteMessage = async (msg) => {
    if (!user?.id) return;
    try {
      const res = await api.deleteMessage(msg.id, token);

      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                text: res?.content || "Message supprimé",
                content: res?.content || "Message supprimé",
                deletedAt: res?.deletedAt || new Date().toISOString(),
              }
            : m
        )
      );

      if (socketRef.current?.connected) {
        socketRef.current.emit("deleteMessage", {
          messageId: msg.id,
          userId: user.id,
          imdbId: id
        });
      }
    } catch (err) {
      console.error("Erreur suppression message:", err);
      alert(err.message || "Erreur lors de la suppression");
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
            onReaction={handleReaction}
            currentUserId={user?.id}
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
                <p><span className="text-black dark:text-white font-medium">Note:</span> {movie.imdbRating ? `${movie.imdbRating}/10` : "Non noté"}</p>
                <p><span className="text-black dark:text-white font-medium">Année:</span> {movie.Year || "Inconnue"}</p>
                <p><span className="text-black dark:text-white font-medium">Pays:</span> {movie.Country || "Inconnu"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT WIDGET (utilisateurs connectes uniquement) */}
      {user?.id && token && (
        <ChatWidget
          chatMessages={chatMessages}
          messageText={messageText}
          chatCollapsed={chatCollapsed}
          onSendMessage={handleSendMessage}
          onMessageChange={(e) => setMessageText(e.target.value)}
          onToggleCollapse={() => setChatCollapsed((v) => !v)}
          movieTitle={movie.Title}
          currentUserId={user?.id}
          onDeleteMessage={handleDeleteMessage}
          lastSeenAt={lastSeenAt}
        />
      )}
    </div>
  );
}
