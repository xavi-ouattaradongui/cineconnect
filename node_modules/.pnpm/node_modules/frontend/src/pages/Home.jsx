import { useState } from "react";
import { Link } from "@tanstack/react-router";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { useSearchMovies, useMovie } from "../hooks/useMovies";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = ["Action", "Comédie", "Horreur", "Sci-Fi", "Aventure", "Romance"];

  // Film du héro - toujours basé sur "Action"
  const { data: heroData } = useSearchMovies("batman");
  const heroMovies = heroData?.Search || [];
  const bestMovie = heroMovies.length > 0 ? heroMovies[0] : null;
  const { data: fullMovie } = useMovie(bestMovie?.imdbID);

  return (
    <div className="w-full">
      <div className="h-24"></div>

      {/* HERO SECTION */}
      {fullMovie && (
        <div className="px-10 mb-8">
          <div
            className="relative min-h-96 bg-cover bg-center rounded-2xl overflow-hidden flex items-center"
            style={{ backgroundImage: `url(${fullMovie.Poster})`, backgroundSize: "cover" }}
          >
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Contenu */}
            <div className="relative z-10 px-6 md:px-10 py-8 md:py-12 max-w-2xl">
              <p className="text-xs md:text-sm text-gray-300 mb-2">⭐ {fullMovie.imdbRating}/10</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 line-clamp-3">{fullMovie.Title}</h2>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6 line-clamp-4">
                {fullMovie.Plot}
              </p>
              
              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/film/${fullMovie.imdbID}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition text-center"
                >
                  Voir les détails
                </Link>
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded font-semibold transition">
                  ♡ Ajouter aux favoris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES */}
      <div className="px-10 mb-8">
        <h1 className="text-3xl font-bold mb-4">Catégories</h1>
        <div className="flex flex-wrap gap-3">
          {/* Bouton Tous */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedCategory === null
                ? "bg-red-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
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
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FILMS */}
      <div className="px-10 py-8">
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory ? selectedCategory : "Tous les films"}
        </h2>

        {selectedCategory ? (
          <SingleCategoryView category={selectedCategory} />
        ) : (
          <AllCategoriesView categories={categories} />
        )}
      </div>
    </div>
  );
}

function SingleCategoryView({ category }) {
  const { data, isLoading } = useSearchMovies(category);
  const movies = data?.Search || [];

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {movies.length > 0 ? (
        movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)
      ) : (
        <p>Aucun film trouvé.</p>
      )}
    </div>
  );
}

function AllCategoriesView({ categories }) {
  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySection key={category} category={category} />
      ))}
    </div>
  );
}

function CategorySection({ category }) {
  const { data, isLoading } = useSearchMovies(category);
  const movies = data?.Search?.slice(0, 6) || [];

  if (isLoading) return <Loader />;
  if (movies.length === 0) return null;

  const handleSeeMore = () => {
    const categoryButton = document.querySelector(`[data-category="${category}"]`);
    if (categoryButton) categoryButton.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{category}</h3>
        <button
          onClick={handleSeeMore}
          className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 transition"
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
