import { db } from "../db/index.js";
import { films } from "../db/schema/films.js";
import { eq, ilike } from "drizzle-orm";

const OMDB_BASE_URL = "https://www.omdbapi.com/";
const OMDB_CACHE_TTL_MS = 1000 * 60 * 30;
const omdbCache = new Map();

const getCachedOmdb = (key) => {
  const entry = omdbCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > OMDB_CACHE_TTL_MS) {
    omdbCache.delete(key);
    return null;
  }
  return entry.value;
};

const setCachedOmdb = (key, value) => {
  omdbCache.set(key, { value, timestamp: Date.now() });
};

const parseYear = (value) => {
  if (!value) return null;
  const parsed = Number.parseInt(String(value).slice(0, 4), 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toOmdbSummary = (film) => ({
  Title: film.title,
  Year: film.year ? String(film.year) : null,
  imdbID: film.imdbId,
  Type: film.type || "movie",
  Poster: film.poster,
});

const toOmdbFromLocal = (film) => ({
  Title: film.title,
  Year: film.year ? String(film.year) : null,
  Rated: film.rated,
  Released: film.released,
  Runtime: film.runtime,
  Genre: film.genre,
  Director: film.director,
  Writer: film.writer,
  Actors: film.actors,
  Plot: film.plot,
  Language: film.language,
  Country: film.country,
  Awards: film.awards,
  Poster: film.poster,
  Metascore: film.metascore,
  imdbRating: film.imdbRating,
  imdbVotes: film.imdbVotes,
  imdbID: film.imdbId,
  Type: film.type || "movie",
  BoxOffice: film.boxOffice,
  Production: film.production,
  Website: film.website,
  Response: "True",
});

const normalizeOmdbSummary = (movie) => ({
  imdbId: movie?.imdbID,
  title: movie?.Title,
  poster: movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : null,
  year: parseYear(movie?.Year),
  type: movie?.Type || "movie",
});

const normalizeOmdbDetails = (movie) => ({
  imdbId: movie?.imdbID,
  title: movie?.Title,
  poster: movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : null,
  year: parseYear(movie?.Year),
  type: movie?.Type || "movie",
  rated: movie?.Rated && movie.Rated !== "N/A" ? movie.Rated : null,
  released: movie?.Released && movie.Released !== "N/A" ? movie.Released : null,
  runtime: movie?.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : null,
  genre: movie?.Genre && movie.Genre !== "N/A" ? movie.Genre : null,
  director: movie?.Director && movie.Director !== "N/A" ? movie.Director : null,
  writer: movie?.Writer && movie.Writer !== "N/A" ? movie.Writer : null,
  actors: movie?.Actors && movie.Actors !== "N/A" ? movie.Actors : null,
  plot: movie?.Plot && movie.Plot !== "N/A" ? movie.Plot : null,
  language: movie?.Language && movie.Language !== "N/A" ? movie.Language : null,
  country: movie?.Country && movie.Country !== "N/A" ? movie.Country : null,
  awards: movie?.Awards && movie.Awards !== "N/A" ? movie.Awards : null,
  metascore: movie?.Metascore && movie.Metascore !== "N/A" ? movie.Metascore : null,
  imdbRating:
    movie?.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null,
  imdbVotes:
    movie?.imdbVotes && movie.imdbVotes !== "N/A" ? movie.imdbVotes : null,
  boxOffice:
    movie?.BoxOffice && movie.BoxOffice !== "N/A" ? movie.BoxOffice : null,
  production:
    movie?.Production && movie.Production !== "N/A" ? movie.Production : null,
  website: movie?.Website && movie.Website !== "N/A" ? movie.Website : null,
});

const fetchOmdb = async (params) => {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) return null;

  const searchParams = new URLSearchParams({ apikey: apiKey, ...params });
  const cacheKey = searchParams.toString();
  const cached = getCachedOmdb(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${OMDB_BASE_URL}?${searchParams.toString()}`);
  if (!response.ok) return null;
  const data = await response.json();
  setCachedOmdb(cacheKey, data);
  return data;
};

// Création d'un film
export const createFilm = async (req, res) => {
  const { imdbId, title, poster, year } = req.body;

  // Validation des champs obligatoires
  if (!imdbId || !title) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // Insertion en base (ignoré si le film existe déjà)
    const [film] = await db
      .insert(films)
      .values({ imdbId, title, poster, year })
      .onConflictDoNothing()
      .returning();

    res.status(201).json(film);
  } catch {
    res.status(400).json({ message: "Film déjà existant" });
  }
};

// Récupération d'un film par son imdbId
export const getFilmByImdbId = async (req, res) => {
  const { imdbId } = req.params;

  const [film] = await db
    .select()
    .from(films)
    .where(eq(films.imdbId, imdbId));

  if (!film) {
    return res.status(404).json({ message: "Film non trouvé" });
  }

  res.json(film);
};

// Recherche DB-first puis fallback OMDb avec persistance locale
export const searchFilms = async (req, res) => {
  const query = (req.query.q || "").toString().trim();
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

  if (!query) {
    return res.status(400).json({ message: "Paramètre q requis" });
  }

  // OMDb first: utilise la clé API en priorité
  const omdbData = await fetchOmdb({ s: query, page: String(page), type: "movie" });
  const omdbMovies = Array.isArray(omdbData?.Search) ? omdbData.Search : [];

  if (omdbMovies.length > 0) {
    const normalized = omdbMovies
      .map(normalizeOmdbSummary)
      .filter((movie) => movie.imdbId && movie.title);

    if (normalized.length > 0) {
      await db
        .insert(films)
        .values(normalized)
        .onConflictDoNothing();
    }

    return res.json({
      Search: omdbMovies,
      totalResults: omdbData?.totalResults || String(omdbMovies.length),
      Response: "True",
    });
  }

  // Fallback DB si OMDb ne renvoie rien (ou clé absente)
  const localMatches = await db
    .select()
    .from(films)
    .where(ilike(films.title, `%${query}%`))
    .limit(24);

  const localMovies = localMatches.map(toOmdbSummary);

  return res.json({
    Search: localMovies,
    totalResults: String(localMovies.length),
    Response: localMovies.length > 0 ? "True" : "False",
  });
};

// Détails DB-first puis fallback OMDb
export const getFilmDetails = async (req, res) => {
  const { imdbId } = req.params;

  const [localFilm] = await db
    .select()
    .from(films)
    .where(eq(films.imdbId, imdbId));

  const omdbData = await fetchOmdb({ i: imdbId, plot: "full" });
  if (omdbData?.Response === "True") {
    const normalized = normalizeOmdbDetails(omdbData);
    if (normalized.imdbId && normalized.title) {
      await db
        .insert(films)
        .values(normalized)
        .onConflictDoUpdate({
          target: films.imdbId,
          set: {
            title: normalized.title,
            poster: normalized.poster,
            year: normalized.year,
            type: normalized.type,
            rated: normalized.rated,
            released: normalized.released,
            runtime: normalized.runtime,
            genre: normalized.genre,
            director: normalized.director,
            writer: normalized.writer,
            actors: normalized.actors,
            plot: normalized.plot,
            language: normalized.language,
            country: normalized.country,
            awards: normalized.awards,
            metascore: normalized.metascore,
            imdbRating: normalized.imdbRating,
            imdbVotes: normalized.imdbVotes,
            boxOffice: normalized.boxOffice,
            production: normalized.production,
            website: normalized.website,
          },
        });
    }
    return res.json(omdbData);
  }

  if (!localFilm) {
    return res.status(404).json({ message: "Film non trouvé" });
  }

  return res.json(toOmdbFromLocal(localFilm));
};
