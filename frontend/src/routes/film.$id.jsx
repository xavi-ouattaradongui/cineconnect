import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { getMovieById } from "../api/omdb"

export const Route = createFileRoute("/film/$id")({
  component: FilmDetail,
})

function FilmDetail() {
  const { id } = Route.useParams()

  const { data, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
  })

  if (isLoading) return <p>Chargement...</p>

  return (
    <div>
      <h2>{data.Title}</h2>
      <img src={data.Poster} width="200" />
      <p>{data.Plot}</p>
      <p>Année : {data.Year}</p>
      <p>Réalisateur : {data.Director}</p>
    </div>
  )
}
