import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
        <a href="/">Accueil</a> |{" "}
        <a href="/films">Films</a> |{" "}
        <a href="/profil">Profil</a> |{" "}
        <a href="/discussion">Discussion</a>
      </nav>

      <Outlet />
    </div>
  ),
})
