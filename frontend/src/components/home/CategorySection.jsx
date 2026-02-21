import { useMemo } from "react";
import { RotateCcw, Smile, Ghost, Zap, Shield, Heart } from "lucide-react";
import { useSearchMoviesMultiTerms } from "../../hooks/useMovies";
import MovieCard from "../MovieCard";
import Loader from "../Loader";
import { getCategorySearchTerms } from "../../utils/categorySearch";

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

export default function CategorySection({ category, displayCount, onSelectCategory, isSelected }) {
  const searchTerms = useMemo(
    () => getCategorySearchTerms(category),
    [category]
  );
  const { data, isLoading } = useSearchMoviesMultiTerms(searchTerms, 1);
  
  // Si la catégorie est sélectionnée, afficher TOUS les films, sinon limiter à displayCount
  const movies = isSelected 
    ? (data?.Search || [])
    : (data?.Search || []).slice(0, displayCount);

  if (isLoading) return <Loader />;
  if (movies.length === 0) return null;

  // Le bouton "Voir plus" ne s'affiche que s'il y a plus de films que displayCount ET que la catégorie n'est pas sélectionnée
  const hasMoreMovies = !isSelected && (data?.Search || []).length > displayCount;

  const handleSeeMore = () => {
    onSelectCategory(category);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          {categoryIcons[category]}
          {category}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {movies.map((m) => (
          <MovieCard key={m.imdbID} movie={m} />
        ))}
      </div>
    </div>
  );
}
