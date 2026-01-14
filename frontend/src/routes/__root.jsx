import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex gap-6">
        <Link to="/" className="font-bold text-xl">
          🎬 CinéConnect
        </Link>
        <Link to="/films" className="text-gray-700 hover:text-black">
          Films
        </Link>
        <Link to="/profil" className="text-gray-700 hover:text-black">
          Profil
        </Link>
        <Link to="/discussion" className="text-gray-700 hover:text-black">
          Discussion
        </Link>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  ),
})

