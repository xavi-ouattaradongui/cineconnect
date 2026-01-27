import { useState, useMemo, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import Loader from "../components/Loader";
import HeroSection from "../components/home/HeroSection";
import CategoryFilters from "../components/home/CategoryFilters";
import CategorySection from "../components/home/CategorySection";
import SearchResults from "../components/home/SearchResults";
import { useSearchMovies, useMovie } from "../hooks/useMovies";
import { useMyList } from "../contexts/MyListContext";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayCount] = useState(6);

  const categories = [
    "Action",
    "Comédie",
    "Horreur",
    "Sci-Fi",
    "Aventure",
    "Romance",
  ];

  // Hero logic
  const heroQuery = useMemo(
    () => categories[Math.floor(Math.random() * categories.length)],
    []
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
  const query = location.search?.q || "";

  return (
    <div className="w-full bg-white dark:bg-black">
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
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* FILMS */}
      <div className="px-10 py-8">
        {!selectedCategory && (
          <h2 className="text-lg font-medium text-black dark:text-white tracking-tight border-b border-gray-200 dark:border-white/10 pb-4 mb-6">
            {query ? `Résultats pour "${query}"` : "Tous les films"}
          </h2>
        )}

        {query ? (
          <SearchResults query={query} />
        ) : selectedCategory ? (
          <CategorySection
            category={selectedCategory}
            displayCount={displayCount}
            onSelectCategory={setSelectedCategory}
            isSelected={true}
          />
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                displayCount={displayCount}
                onSelectCategory={setSelectedCategory}
                isSelected={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

