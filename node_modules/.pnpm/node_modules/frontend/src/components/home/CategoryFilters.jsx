import { RotateCcw, Smile, Ghost, Zap, Shield, Heart } from "lucide-react";

const categoryIcons = {
  Action: <RotateCcw size={18} />,
  Comédie: <Smile size={18} />,
  Horreur: <Ghost size={18} />,
  "Sci-Fi": <Zap size={18} />,
  Aventure: <Shield size={18} />,
  Romance: <Heart size={18} />,
};

export default function CategoryFilters({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) {
  return (
    <section className="w-full space-y-4 px-10 mb-8 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 shrink-0">
          Parcourir par catégorie
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Bouton Tous */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm ${
            selectedCategory === null
              ? "bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white"
              : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/10"
          }`}
        >
          Tous
        </button>

        {/* Boutons Catégories */}
        {categories.map((category) => (
          <button
            key={category}
            data-category={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm ${
              selectedCategory === category
                ? "bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white"
                : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/10"
            }`}
          >
            {categoryIcons[category]}
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
