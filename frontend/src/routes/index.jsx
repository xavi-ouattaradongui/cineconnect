import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: () => <h2>Bienvenue sur CinéConnect 🎬</h2>,
})
