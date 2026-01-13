import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/profil")({
  component: () => <h2>Profil utilisateur</h2>,
})
