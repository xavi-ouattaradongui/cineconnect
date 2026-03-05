import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSectionMovies } from "../../hooks/useSectionMovies";
import MovieCard from "../shared/MovieCard";
import Loader from "../shared/Loader";

const sectionTitles = {
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

export default function ExploreItemSection({ section, displayCount }) {
  const { data, isLoading } = useSectionMovies(section);
  
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Toujours afficher displayCount films
  const movies = (data?.Search || []).slice(0, displayCount);

  if (isLoading) return <Loader />;
  if (movies.length === 0) return null;

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const sectionTitle = sectionTitles[section] || section;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-black dark:text-white">
          {sectionTitle}
        </h3>
        <Link
          to="/explorez/$section"
          params={{ section }}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Voir tous
        </Link>
      </div>

      <div className="relative group/carousel">
        {/* Bouton gauche */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Précédent"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Bouton droit */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Suivant"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Conteneur scrollable */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((m) => (
            <div key={m.imdbID} className="flex-shrink-0 w-[200px]">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
