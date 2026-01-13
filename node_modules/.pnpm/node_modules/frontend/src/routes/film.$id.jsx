import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/film/$id")({
  component: () => {
    const { id } = Route.useParams()
    return <h2>Détail du film {id}</h2>
  },
})
