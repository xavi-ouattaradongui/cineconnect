import { useMemo, useRef, useState } from "react";
import { RotateCcw, Smile, Ghost, Zap, Shield, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchMoviesMultiTerms } from "../../hooks/useMovies";
import MovieCard from "../shared/MovieCard";
import Loader from "../shared/Loader";
import { getCategorySearchTerms } from "../../utils/categorySearch";
import { getCategoryDisplayName } from "../../utils/categoryNames";

const categoryIcons = {
  Action: <RotateCcw size={18} />,
  Comédie: <Smile size={18} />,
  Horreur: <Ghost size={18} />,
  "Sci-Fi": <Zap size={18} />,
  Aventure: <Shield size={18} />,
  Romance: <Heart size={18} />,
  Thriller: <Zap size={18} />,
  Drame: <Heart size={18} />,
  Animation: <Smile size={18} />,
  Fantasy: <Shield size={18} />,
  Crime: <Shield size={18} />,
  Western: <RotateCcw size={18} />,
  Documentaire: <Smile size={18} />,
  Mystere: <Ghost size={18} />,
};

export default function CategorySection({ category, displayCount, onSelectCategory, onSeeMore, isSelected }) {
  const searchTerms = useMemo(
    () => getCategorySearchTerms(category),
    [category]
  );
  const { data, isLoading } = useSearchMoviesMultiTerms(searchTerms, 1);
  
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Toujours afficher displayCount films
  const movies = (data?.Search || []).slice(0, displayCount);

  if (isLoading) return <Loader />;
  if (movies.length === 0) return null;

  // Le bouton "Voir plus" s'affiche s'il y a plus de films que displayCount
  const hasMoreMovies = (data?.Search || []).length > displayCount;

  const handleSeeMore = () => {
    onSeeMore(category);
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          {categoryIcons[category]}
          {getCategoryDisplayName(category)}
        </h3>

        {/* Le bouton "Voir plus" ne s'affiche que s'il y a plus de films ET que la catégorie n'est pas sélectionnée */}
        {hasMoreMovies && (
          <button
            onClick={handleSeeMore}
            className="group flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
          >
            <span>Voir tout</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="relative group/carousel">
        {/* Bouton gauche */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Précédent"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Bouton droit */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            aria-label="Suivant"
          >
            <ChevronRight size={24} />
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
