import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const DETAIL_CACHE = new Map();
const BATCH_SIZE = 5;
const BATCH_DELAY = 150;

export const normalizeOmdbValue = (value) => {
  if (value == null) return null;
  const normalized = value.toString().trim();
  return normalized !== "" && normalized !== "N/A" ? value : null;
};

const hasValue = (value) => normalizeOmdbValue(value) !== null;

export const normalizeMovieData = (movie) => {
  if (!movie || typeof movie !== "object") return movie;

  return Object.fromEntries(
    Object.entries(movie).map(([key, value]) => [key, normalizeOmdbValue(value)])
  );
};

export const hasUsableMovieSummary = (movie) => {
  if (!movie?.imdbID) return false;
  return [movie.Title, movie.Year, movie.Poster].every(hasValue);
};

export const hasUsableMovieDetails = (movie) => {
  return hasUsableMovieSummary(movie);
};

export const filterUsableMovies = (movies = []) =>
  movies.map(normalizeMovieData).filter(hasUsableMovieSummary);

export const omdb = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: { apikey: API_KEY },
});

export const searchMovies = async (title, page = 1) => {
  const { data } = await omdb.get("/", {
    params: { s: title, page, type: "movie" },
  });
  const filteredMovies = filterUsableMovies(data?.Search || []);

  return {
    ...data,
    Search: filteredMovies,
    totalResults: filteredMovies.length,
    Response: filteredMovies.length ? "True" : "False",
  };
};

export const searchMoviesPages = async (title, pages = 2) => {
  const pageCount = Math.max(1, pages);
  const requests = Array.from({ length: pageCount }, (_, index) =>
    searchMovies(title, index + 1)
  );
  const results = await Promise.all(requests);
  const merged = results.flatMap((result) => result?.Search || []);

  const unique = [];
  const seen = new Set();
  for (const movie of merged) {
    if (!movie?.imdbID || seen.has(movie.imdbID)) continue;
    seen.add(movie.imdbID);
    unique.push(movie);
  }

  const filteredMovies = filterUsableMovies(unique);

  return {
    Search: filteredMovies,
    totalResults: filteredMovies.length,
    Response: filteredMovies.length ? "True" : "False",
  };
};

export const searchMoviesMultiTerms = async (terms, pagesPerTerm = 1) => {
  const termList = Array.isArray(terms) ? terms.filter(Boolean) : [];
  if (termList.length === 0) {
    return { Search: [], totalResults: 0, Response: "False" };
  }

  const pageCount = Math.max(1, pagesPerTerm);
  const requests = termList.flatMap((term) =>
    Array.from({ length: pageCount }, (_, index) =>
      searchMovies(term, index + 1)
    )
  );

  const results = await Promise.all(requests);
  const merged = results.flatMap((result) => result?.Search || []);

  const unique = [];
  const seen = new Set();
  for (const movie of merged) {
    if (!movie?.imdbID || seen.has(movie.imdbID)) continue;
    seen.add(movie.imdbID);
    unique.push(movie);
  }

  const filteredMovies = filterUsableMovies(unique);

  return {
    Search: filteredMovies,
    totalResults: filteredMovies.length,
    Response: filteredMovies.length ? "True" : "False",
  };
};

const normalizeGenre = (value) =>
  (value || "").toString().trim().toLowerCase();

const movieHasGenre = (movie, genres) => {
  if (!movie?.Genre || genres.length === 0) return false;
  const movieGenres = movie.Genre.split(",").map(normalizeGenre);
  return genres.some((genre) => movieGenres.includes(normalizeGenre(genre)));
};

export const searchMoviesByGenre = async (
  terms,
  pagesPerTerm = 1,
  genres = []
) => {
  const termList = Array.isArray(terms) ? terms.filter(Boolean) : [];
  if (termList.length === 0) {
    return { Search: [], totalResults: 0, Response: "False" };
  }

  const pageCount = Math.max(1, pagesPerTerm);
  const requests = termList.flatMap((term) =>
    Array.from({ length: pageCount }, (_, index) =>
      searchMovies(term, index + 1)
    )
  );

  const results = await Promise.all(requests);
  const merged = results.flatMap((result) => result?.Search || []);

  const unique = [];
  const seen = new Set();
  for (const movie of merged) {
    if (!movie?.imdbID || seen.has(movie.imdbID)) continue;
    seen.add(movie.imdbID);
    unique.push(movie);
  }

  const normalizedGenres = Array.isArray(genres)
    ? genres.map(normalizeGenre).filter(Boolean)
    : [];
  if (normalizedGenres.length === 0) {
    const filteredMovies = filterUsableMovies(unique);
    return {
      Search: filteredMovies,
      totalResults: filteredMovies.length,
      Response: filteredMovies.length ? "True" : "False",
    };
  }

  const details = await batchFetchDetails(
    unique.map((m) => m.imdbID)
  );

  const filtered = unique.filter((movie, index) => {
    const detail = details[index];
    return detail ? movieHasGenre(detail, normalizedGenres) : false;
  });

  return {
    Search: filtered,
    totalResults: filtered.length,
    Response: filtered.length ? "True" : "False",
  };
};

export const getMovieDetails = async (id) => {
  if (DETAIL_CACHE.has(id)) {
    return DETAIL_CACHE.get(id);
  }
  try {
    const { data } = await omdb.get("/", { params: { i: id, plot: "full" } });
    const movie = data?.Response === "False" ? null : normalizeMovieData(data);
    const validMovie = hasUsableMovieDetails(movie) ? movie : null;
    DETAIL_CACHE.set(id, validMovie);
    return validMovie;
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error);
    return null;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const batchFetchDetails = async (ids) => {
  const results = [];
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((id) => getMovieDetails(id))
    );
    results.push(...batchResults);
    if (i + BATCH_SIZE < ids.length) {
      await sleep(BATCH_DELAY);
    }
  }
  return results;
};

