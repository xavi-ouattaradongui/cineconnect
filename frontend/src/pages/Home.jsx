import { useState, useMemo, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import Loader from "../components/shared/Loader";
import HeroSection from "../components/home/HeroSection";
import CategoryFilters from "../components/home/CategoryFilters";
import CategorySection from "../components/home/CategorySection";
import SearchResults from "../components/home/SearchResults";
import { useSearchMovies, useMovie } from "../hooks/useMovies";
import { useCategories } from "../hooks/useCategories";
import { useMyList } from "../contexts/MyListContext";

export default function Home() {
  const displayCount = 6;
  const navigate = useNavigate();
  const [visibleCategories, setVisibleCategories] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  // Hero logic
  const heroQuery = useMemo(
    () => {
      if (!categories || categories.length === 0) return null;
      return categories[Math.floor(Math.random() * categories.length)];
    },
    [categories]
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
      const candidates = heroMovies.slice(0, 6);
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
  const query = useMemo(() => {
    const search = location?.search;
    if (!search) return "";
    if (typeof search === "string") {
      return new URLSearchParams(search).get("q") || "";
    }
    return search.q || "";
  }, [location?.search]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSeeMore = (category) => {
    navigate({ to: "/categorie/$category", params: { category } });
  };

  return (
    <div className="w-full bg-white dark:bg-black">
      {isCategoriesLoading ? (
        <div className="px-10 py-8">
          <Loader />
        </div>
      ) : (
        <>
          {/* HERO SECTION */}
          {!query && (
            <HeroSection
              heroPicking={heroPicking}
              fullMovie={fullMovie}
              isInList={isInList}
              onAddToList={handleHeroListClick}
            />
          )}

          {/* CATEGORIES */}
          {!query && (
            <CategoryFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          )}

          {/* FILMS */}
          <div className="px-10 py-8">
            {query ? (
              <SearchResults query={query} />
            ) : (
              <>
                <h2 className="text-lg font-medium text-black dark:text-white tracking-tight border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
                  {selectedCategory ? `${selectedCategory}` : "Tous les films"}
                </h2>
                <div className="space-y-8">
                  {selectedCategory ? (
                    <CategorySection
                      key={selectedCategory}
                      category={selectedCategory}
                      displayCount={displayCount}
                      onSelectCategory={handleCategorySelect}
                      onSeeMore={handleSeeMore}
                      isSelected={true}
                    />
                  ) : (
                    categories.slice(0, visibleCategories).map((category) => (
                      <CategorySection
                        key={category}
                        category={category}
                        displayCount={displayCount}
                        onSelectCategory={handleCategorySelect}
                        onSeeMore={handleSeeMore}
                        isSelected={false}
                      />
                    ))
                  )}
                </div>
                {!selectedCategory && visibleCategories < categories.length && (
                  <div className="flex justify-center mt-8">
                    <button
                      type="button"
                      onClick={() => setVisibleCategories((c) => c + 3)}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-400 transition-colors"
                    >
                      Charger plus
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

