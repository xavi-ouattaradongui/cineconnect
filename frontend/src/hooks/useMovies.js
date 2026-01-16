import { useQuery } from "@tanstack/react-query";
import { searchMovies, getMovieDetails } from "../api/omdb";

export const useSearchMovies = (title = "Batman") => {
  return useQuery({
    queryKey: ["search", title],
    queryFn: () => searchMovies(title),
    enabled: !!title,
  });
};

export const useMovie = (id) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });
};


