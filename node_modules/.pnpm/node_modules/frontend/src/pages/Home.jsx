import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import CategoryList from "../components/CategoryList";
import Loader from "../components/Loader";
import { useSearchMovies } from "../hooks/useMovies";

export default function Home() {
  const [search, setSearch] = useState("Batman");
  const categories = ["Action", "Comédie", "Horreur", "Sci-Fi", "Aventure", "Romance"];

  const { data, isLoading } = useSearchMovies(search);

  const movies = data?.Search || [];

  return (
    <div className="w-full">

      {/* NAVBAR */}
      <Navbar onSearch={setSearch} />

      {/* ESPACEMENT NAV */}
      <div className="h-24"></div>

      {/* TITRE */}
      <h1 className="text-3xl font-bold px-10 mb-4">Films populaires</h1>

      {/* CATEGORIES */}
      <div className="px-10">
        <CategoryList
          categories={categories}
          onSelect={(c) => setSearch(c)}
        />
      </div>

      {/* RESULTATS */}
      <div className="px-10 py-8">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.length > 0 ? (
              movies.map((m) => <MovieCard key={m.imdbID} movie={m} />)
            ) : (
              <p>Aucun film trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
