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
  if (!data) return null

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex gap-6">
        <img
          src={data.Poster}
          alt={data.Title}
          className="w-64 rounded"
        />

        <div>
          <h2 className="text-3xl font-bold mb-2">{data.Title}</h2>
          <p className="text-gray-600 mb-4">{data.Plot}</p>

          <p><strong>Année :</strong> {data.Year}</p>
          <p><strong>Réalisateur :</strong> {data.Director}</p>
        </div>
      </div>
    </div>
  )
}

