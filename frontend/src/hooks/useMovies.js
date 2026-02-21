import { useQuery } from "@tanstack/react-query";
import {
  searchMovies,
  searchMoviesPages,
  searchMoviesMultiTerms,
  getMovieDetails,
} from "../api/omdb";

export const useSearchMovies = (title = "Batman") => {
  return useQuery({
    queryKey: ["search", title],
    queryFn: () => searchMovies(title),
    enabled: !!title,
  });
};

export const useSearchMoviesPages = (title, pages = 2) => {
  return useQuery({
    queryKey: ["search", title, pages],
    queryFn: () => searchMoviesPages(title, pages),
    enabled: !!title,
    keepPreviousData: true,
  });
};

export const useSearchMoviesMultiTerms = (terms, pagesPerTerm = 1) => {
  const termKey = Array.isArray(terms) ? terms.join("|") : "";
  return useQuery({
    queryKey: ["search-terms", termKey, pagesPerTerm],
    queryFn: () => searchMoviesMultiTerms(terms, pagesPerTerm),
    enabled: Array.isArray(terms) ? terms.length > 0 : false,
    keepPreviousData: true,
  });
};

export const useMovie = (id) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });
};


