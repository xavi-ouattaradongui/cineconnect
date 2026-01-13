import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/discussion")({
  component: () => <h2>Discussion</h2>,
})
