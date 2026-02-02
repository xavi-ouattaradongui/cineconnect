import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const useReviews = (filmId) => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ["reviews", filmId],
    queryFn: () => api.getReviews(filmId, token),
    enabled: !!filmId,
  });

  const createReview = useMutation({
    mutationFn: ({ rating, comment, title, poster, year }) => 
      api.createReview({ rating, comment, filmId, title, poster, year }, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", filmId]);
    },
  });

  const updateReview = useMutation({
    mutationFn: ({ reviewId, rating, comment }) => 
      api.updateReview(reviewId, { rating, comment }, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", filmId]);
    },
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId) => api.deleteReview(reviewId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", filmId]);
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      alert(error.message);
    }
  });

  return {
    reviews,
    isLoading,
    error,
    createReview,
    updateReview,
    deleteReview,
  };
};
