import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { searchMovies } from "../api/omdb"

export const Route = createFileRoute("/films")({
  component: Films,
})

function Films() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", "batman"],
    queryFn: () => searchMovies("batman"),
  })

  if (isLoading) return <p>Chargement...</p>
  if (error) return <p>Erreur</p>

  if (data?.Response === "False") {
    return <p>{data.Error}</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Films</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.Search.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-white rounded shadow hover:shadow-lg transition p-4"
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-64 object-cover mb-4"
            />

            <h3 className="font-semibold">{movie.Title}</h3>
            <p className="text-sm text-gray-500">{movie.Year}</p>

            <Link
              to="/film/$id"
              params={{ id: movie.imdbID }}
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
            >
              Voir le film
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

