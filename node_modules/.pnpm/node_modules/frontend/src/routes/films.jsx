import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/films")({
  component: () => <h2>Liste des films</h2>,
})
