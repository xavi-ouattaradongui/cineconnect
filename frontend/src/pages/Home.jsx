import { useState, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import Loader from "../components/shared/Loader";
import MovieCard from "../components/shared/MovieCard";
import HeroSection from "../components/home/HeroSection";
import ExploreSection from "../components/home/ExploreSection";
import ExploreItemSection from "../components/home/ExploreItemSection";
import SearchResults from "../components/home/SearchResults";
import { useSearchMovies, useMovie } from "../hooks/useMovies";
import { useSectionMovies } from "../hooks/useSectionMovies";
import { useCategories } from "../hooks/useCategories";
import { useMyList } from "../contexts/MyListContext";

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null);

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  // Fetch movies for selected section
  const { data: sectionMoviesData, isLoading: isSectionMoviesLoading } =
    useSectionMovies(selectedSection);

  // Hero logic
  const heroCategories = ["Action", "Comédie", "Animation", "Crime"];
  const heroQuery = useMemo(
    () => {
      const availableHeroCategories = heroCategories.filter((category) =>
        categories.includes(category)
      );
      const source =
        availableHeroCategories.length > 0 ? availableHeroCategories : heroCategories;
      return source[Math.floor(Math.random() * source.length)];
    },
    [categories]
  );
  const { data: heroData, isLoading: isHeroMoviesLoading } = useSearchMovies(heroQuery);
  const heroMovies = heroData?.Search || [];
  const heroRandomId = useMemo(() => {
    if (!heroMovies.length) return null;
    const randomMovie = heroMovies[Math.floor(Math.random() * heroMovies.length)];
    return randomMovie?.imdbID || null;
  }, [heroMovies]);

  const { data: fullMovie, isLoading: isHeroMovieLoading } = useMovie(heroRandomId);
  const heroPicking = isHeroMoviesLoading || isHeroMovieLoading;
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

  const getSectionTitle = (section) => {
    const titles = {
      trending: "On pense que vous allez adorer",
      recommended: "Trouvez votre prochain coup de cœur",
      discover: "Pépites pour vous",
      new: "Nouveautés",
      popular: "Grands succès",
      mustWatch: "À ne pas manquer",
      actionNonStop: "Films d'action",
      comedy: "Comédies",
      thriller: "Thrillers",
      sciFi: "Films de science-fiction",
      futuristicSciFi: "SF futuriste",
      alienSciFi: "Aliens et science-fiction",
      international: "Films internationaux",
      anime: "Anime japonais",
      family: "À voir en famille",
    };
    return titles[section] || "";
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

          {/* HOME SECTIONS */}
          {!query && (
            <ExploreSection
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
            />
          )}

          {/* FILMS */}
          <div className="px-10 py-8">
            {query ? (
              <SearchResults query={query} />
            ) : selectedSection ? (
              // Show section movies
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ← Retour
                  </button>
                  <h2 className="text-lg font-medium text-black dark:text-white tracking-tight border-b border-gray-200 dark:border-white/10 pb-4 flex-1">
                    {getSectionTitle(selectedSection)}
                  </h2>
                </div>
                {isSectionMoviesLoading ? (
                  <Loader />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {sectionMoviesData?.Search?.slice(0, 24)?.map(
                      (movie) => (
                        <MovieCard key={movie.imdbID} movie={movie} />
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4">
                  Explorez nos collections
                </h2>
                <div className="space-y-8">
                  {['trending', 'recommended', 'discover', 'new', 'popular', 'mustWatch', 'actionNonStop', 'comedy', 'thriller', 'sciFi', 'futuristicSciFi', 'alienSciFi', 'international', 'anime', 'family'].map((section) => (
                    <ExploreItemSection
                      key={section}
                      section={section}
                      displayCount={15}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

