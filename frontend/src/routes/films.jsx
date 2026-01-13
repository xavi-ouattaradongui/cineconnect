import { createFileRoute } from "@tanstack/react-router"
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

  return (
    <div>
      <h2>Films</h2>

      <ul>
        {data?.Search?.map((movie) => (
          <li key={movie.imdbID}>
            <a href={`/film/${movie.imdbID}`}>
              {movie.Title} ({movie.Year})
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
