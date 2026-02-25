import { useState } from "react";
import { RotateCcw, Smile, Ghost, Zap, Shield, Heart, MoreHorizontal } from "lucide-react";

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
  const [showMore, setShowMore] = useState(false);

  // Trouver l'index de "Fantasy" pour limiter l'affichage
  const fantasyIndex = categories.findIndex(cat => cat === "Fantasy");
  const visibleCategories = fantasyIndex !== -1 
    ? categories.slice(0, fantasyIndex + 1) 
    : categories;
  const hiddenCategories = fantasyIndex !== -1 
    ? categories.slice(fantasyIndex + 1) 
    : [];

  const buttonClass = (isSelected) => `whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm shrink-0 ${
    isSelected
      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border border-indigo-600 shadow-lg"
      : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/10"
  }`;

  return (
    <section className="w-full space-y-4 px-10 mb-8 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 shrink-0">
          Parcourir par catégorie
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 px-2 relative">
        {/* Bouton Tous */}
        <button
          onClick={() => onSelectCategory(null)}
          className={buttonClass(selectedCategory === null)}
        >
          Tous
        </button>

        {/* Afficher les catégories visibles + les cachées si showMore */}
        {(showMore ? categories : visibleCategories).map((category) => (
          <button
            key={category}
            data-category={category}
            onClick={() => onSelectCategory(category)}
            className={buttonClass(selectedCategory === category)}
          >
            {categoryIcons[category]}
            {category}
          </button>
        ))}

        {/* Bouton "Plus" pour afficher les catégories restantes */}
        {!showMore && hiddenCategories.length > 0 && (
          <button
            onClick={() => setShowMore(true)}
            className={buttonClass(false) + " !bg-gray-100 dark:!bg-white/5"}
          >
            <MoreHorizontal size={18} />
            Plus
          </button>
        )}
      </div>
    </section>
  );
}
