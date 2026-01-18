import { useMyList } from "../contexts/MyListContext";
import MovieCard from "../components/MovieCard";

export default function MyList() {
  const { myList } = useMyList();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ma Liste</h1>
          <p className="text-gray-400">
            {myList.length} film{myList.length > 1 ? "s" : ""} dans votre liste
          </p>
        </div>

        {myList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg mb-4">Votre liste est vide</p>
            <p className="text-gray-600 text-sm">Cliquez sur le + pour ajouter des films à votre liste</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {myList.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
