import { useState, useRef } from "react";
import { RotateCcw, Smile, Ghost, Zap, Shield, Heart, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function CategoryFilters({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const buttonClass = (isSelected) => `whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm shrink-0 ${
    isSelected
      ? "bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-lg"
      : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/10"
  }`;

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
      const scrollAmount = container.clientWidth * 0.6;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="w-full space-y-4 px-10 mb-8 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 shrink-0">
          Parcourir par catégorie
        </h3>
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
          className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Bouton Tous */}
          <button
            onClick={() => onSelectCategory(null)}
            className={buttonClass(selectedCategory === null)}
          >
            Tous
          </button>

          {/* Toutes les catégories */}
          {categories.map((category) => (
            <button
              key={category}
              data-category={category}
              onClick={() => onSelectCategory(category)}
              className={buttonClass(selectedCategory === category)}
            >
              {categoryIcons[category]}
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
