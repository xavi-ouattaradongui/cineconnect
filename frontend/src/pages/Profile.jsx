import { Link } from "@tanstack/react-router";
import {
  List,
  Heart,
  MessageSquare,
  Users,
  UserPlus,
  Pencil,
} from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import MovieCard from "../components/MovieCard";

export default function Profile() {
  const { favorites } = useFavorites();
  const { myList } = useMyList();

  return (
    <div className="min-h-screen bg-black text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <Link
              to="/ma-liste"
              className="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white transition"
            >
              <List size={16} />
              Listes & Collections
            </Link>
            <Link
              to="/favoris"
              className="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white transition"
            >
              <Heart size={16} />
              Favoris
            </Link>
            <button className="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 hover:bg-white/5 hover:text-white transition w-full text-left">
              <MessageSquare size={16} />
              Messages
            </button>

            <div className="pt-6 border-t border-white/10">
              <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Social
              </p>
              <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 hover:text-white transition w-full text-left">
                <Users size={16} />
                Abonnés <span className="ml-auto text-xs opacity-60">128</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 hover:text-white transition w-full text-left">
                <UserPlus size={16} />
                Abonnements{" "}
                <span className="ml-auto text-xs opacity-60">42</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="md:col-span-9 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-red-500 to-purple-600 p-[2px] shadow-2xl shadow-red-500/10">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop"
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover border-4 border-black"
                  />
                  <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 border-4 border-black rounded-full" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-semibold text-white">
                      Jean Dupont
                    </h1>
                  </div>
                  <p className="text-sm font-medium">@jeandupont</p>
                </div>
              </div>

              <Link
                to="/profil/edition"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-xs font-medium transition shadow-sm"
              >
                <Pencil size={14} />
                Modifier le profil
              </Link>
            </div>

            {/* Favoris */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-white">
                  <Heart size={14} className="text-red-500" />
                  Favoris
                </h2>
                <Link
                  to="/favoris"
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  Voir tout
                </Link>
              </div>

              {favorites.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Aucun favori pour le moment.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favorites.slice(0, 5).map((m) => (
                    <MovieCard key={m.imdbID} movie={m} />
                  ))}
                </div>
              )}
            </section>

            {/* Ma Liste */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-white">
                  <List size={14} className="text-blue-400" />
                  Ma Liste
                </h2>
                <Link
                  to="/ma-liste"
                  className="text-xs text-gray-400 hover:text-white transition"
                >
                  Voir tout
                </Link>
              </div>

              {myList.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Votre liste est vide.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {myList.slice(0, 5).map((m) => (
                    <MovieCard key={m.imdbID} movie={m} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
