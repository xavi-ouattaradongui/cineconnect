import { useState, useMemo, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Star, Plus, RotateCcw, Smile, Ghost, Zap, Shield, Heart, Check } from "lucide-react";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { useSearchMovies, useMovie } from "../hooks/useMovies";
import { useMyList } from "../contexts/MyListContext";

const categoryIcons = {
  Action: <RotateCcw size={18} />,
  Comédie: <Smile size={18} />,
  Horreur: <Ghost size={18} />,
  "Sci-Fi": <Zap size={18} />,
  Aventure: <Shield size={18} />,
  Romance: <Heart size={18} />,
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✔️ 6 films par catégorie sur la page d’accueil
  const [displayCount] = useState(6);

  const categories = [
    "Action",
    "Comédie",
    "Horreur",
    "Sci-Fi",
    "Aventure",
    "Romance",
  ];

  // Reco hero : catégorie aléatoire + meilleur noté de cette catégorie
  const heroQuery = useMemo(
    () => categories[Math.floor(Math.random() * categories.length)],
    [] // une seule fois par montage
  );
  const { data: heroData } = useSearchMovies(heroQuery);
  const heroMovies = heroData?.Search || [];

  const [heroBestId, setHeroBestId] = useState(null);
  const [heroPicking, setHeroPicking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const pickBest = async () => {
      if (!heroMovies.length) return;
      setHeroPicking(true);
      const candidates = heroMovies.slice(0, 6); // limite pour éviter trop d'appels
      const results = await Promise.all(
        candidates.map(async (m) => {
          try {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&i=${m.imdbID}`
            );
            const data = await res.json();
            const rating = parseFloat(data.imdbRating) || 0;
            return { movie: m, rating };
          } catch {
            return { movie: m, rating: 0 };
          }
        })
      );
      if (cancelled || results.length === 0) return;
      const best = results.reduce((best, cur) =>
        cur.rating > best.rating ? cur : best
      );
      setHeroBestId(best.movie.imdbID);
      setHeroPicking(false);
    };
    pickBest();
    return () => {
      cancelled = true;
    };
  }, [heroMovies]);

  const { data: fullMovie } = useMovie(heroBestId);
  const { addToList, removeFromList, isInList } = useMyList();

  const handleHeroListClick = () => {
    if (!fullMovie) return;
    const id = fullMovie.imdbID;
    if (isInList(id)) {
      removeFromList(id);
    } else {
      addToList({
        imdbID: id,
        Title: fullMovie.Title,
        Poster: fullMovie.Poster,
        Year: fullMovie.Year,
      });
    }
  };

  const { location } = useRouterState();
  const query = location.search?.q || "";

  return (
    <div className="w-full bg-white dark:bg-black">
      {/* HERO SECTION - Hauteur réduite avec bords arrondis en bas */}
      {!query && (
        heroPicking ? (
          <div className="relative w-full h-[70vh] overflow-hidden rounded-b-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />
        ) : fullMovie ? (
          <div className="relative w-full h-[70vh] overflow-hidden rounded-b-3xl group">
            <img
              src={fullMovie.Poster}
              alt={fullMovie.Title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-8 w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase">
                  À la une
                </span>
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                  <Star size={12} fill="currentColor" />
                  {fullMovie.imdbRating}
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-3">
                {fullMovie.Title}
              </h1>
              <p className="text-gray-300 text-sm max-w-lg mb-6 leading-relaxed line-clamp-2">
                {fullMovie.Plot}
              </p>

              <div className="flex gap-3">
                <Link
                  to={`/film/${fullMovie.imdbID}`}
                  className="hover:bg-gray-200 transition-colors flex text-sm font-medium text-black bg-white rounded-lg px-5 py-2.5 items-center gap-2"
                >
                  Détails
                </Link>
                <button
                  onClick={handleHeroListClick}
                  className="bg-white/10 text-white border border-white/10 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  {isInList(fullMovie.imdbID) ? (
                    <>
                      <Check size={16} />
                      Dans ma liste
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Ajouter à ma liste
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* CATEGORIES */}
      {!query && (
        <section className="w-full space-y-4 px-10 mb-8 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 shrink-0">
              Parcourir par catégorie
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Bouton Tous */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                selectedCategory === null
                  ? "bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white"
                  : "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
              }`}
            >
              Tous
            </button>

            {/* Boutons Catégories */}
            {categories.map((category) => (
              <button
                key={category}
                data-category={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  selectedCategory === category
                    ? "bg-white text-black border border-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {categoryIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* FILMS */}
      <div className="px-10 py-8">
        <h2 className="text-lg font-medium text-black dark:text-white tracking-tight border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
          {query
            ? `Résultats pour "${query}"`
            : selectedCategory
            ? selectedCategory
            : "Tous les films"}
        </h2>

        {query ? (
          <SearchResultsView query={query} />
        ) : selectedCategory ? (
          <SingleCategoryView category={selectedCategory} />
        ) : (
          <AllCategoriesView categories={categories} displayCount={displayCount} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------
   🔥 SINGLE CATEGORY VIEW (tous les films)
------------------------------------------- */

function SingleCategoryView({ category }) {
  const { data, isLoading } = useSearchMovies(category);
  const movies = data?.Search || [];

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {movies.length > 0 ? (
        movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Aucun film trouvé.</p>
      )}
    </div>
  );
}

/* ------------------------------------------
   🏠 VIEW ACCUEIL (6 films par catégorie)
------------------------------------------- */

function AllCategoriesView({ categories, displayCount }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySection key={category} category={category} displayCount={displayCount} />
      ))}
    </div>
  );
}

function CategorySection({ category, displayCount }) {
  const { data, isLoading } = useSearchMovies(category);

  // ✔️ On affiche uniquement 6 films à l'accueil
  const movies = (data?.Search || []).slice(0, displayCount);

  if (isLoading) return <Loader />;
  if (movies.length === 0) return null;

  const handleSeeMore = () => {
    const categoryButton = document.querySelector(`[data-category="${category}"]`);
    if (categoryButton) categoryButton.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          {categoryIcons[category]}
          {category}
        </h3>
        <button
          onClick={handleSeeMore}
          className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-200 font-semibold flex items-center gap-2 transition border border-gray-300 dark:border-white/20 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        >
          Voir plus →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((m) => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div>
    </div>
  );
}

function SearchResultsView({ query }) {
  const { data, isLoading } = useSearchMovies(query);
  const movies = data?.Search || [];

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {movies.length > 0 ? (
        movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-sm">Aucun film trouvé pour "{query}".</p>
      )}
    </div>
  );
}

