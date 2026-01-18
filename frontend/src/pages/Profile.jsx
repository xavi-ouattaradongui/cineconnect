import { Link, useRouter } from "@tanstack/react-router";
import {
  List,
  Heart,
  Pencil,
  LogOut,
  Skull,
  Ghost,
  Zap,
  Flame,
  Crown,
  Swords,
  Sparkles,
  Moon,
  Sun,
  Camera,
  Star,
} from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useMyList } from "../contexts/MyListContext";
import { useAuth } from "../contexts/AuthContext";
import MovieCard from "../components/MovieCard";

const AVATAR_ICONS = {
  skull: Skull,
  ghost: Ghost,
  zap: Zap,
  heart: Heart,
  star: Star,
  flame: Flame,
  crown: Crown,
  swords: Swords,
  sparkles: Sparkles,
  moon: Moon,
  sun: Sun,
  camera: Camera,
};

const AVATAR_COLORS = {
  skull: "from-gray-500 to-gray-700",
  ghost: "from-purple-500 to-indigo-600",
  zap: "from-yellow-500 to-orange-600",
  heart: "from-pink-500 to-red-600",
  star: "from-yellow-400 to-amber-600",
  flame: "from-orange-500 to-red-600",
  crown: "from-yellow-500 to-yellow-600",
  swords: "from-gray-400 to-gray-600",
  sparkles: "from-cyan-400 to-blue-600",
  moon: "from-indigo-400 to-purple-600",
  sun: "from-yellow-400 to-orange-500",
  camera: "from-gray-500 to-slate-700",
};

export default function Profile() {
  const { favorites } = useFavorites();
  const { myList } = useMyList();
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Veuillez vous connecter</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  const getInitials = (displayName) => {
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarIcon = () => {
    const Icon = AVATAR_ICONS[user.avatar];
    if (Icon) {
      return <Icon size={40} className="text-white" />;
    }
    return (
      <span className="text-2xl font-bold text-white">
        {getInitials(user.displayName)}
      </span>
    );
  };

  const getAvatarColor = () => {
    return AVATAR_COLORS[user.avatar] || "from-red-500 to-purple-600";
  };

  const hasIconPreset = !!AVATAR_ICONS[user.avatar];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <Link
              to="/ma-liste"
              className="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition"
            >
              <List size={16} />
              Listes & Collections
            </Link>
            <Link
              to="/favoris"
              className="flex items-center gap-3 text-sm font-medium rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition"
            >
              <Heart size={16} />
              Favoris
            </Link>
          </aside>

          {/* Main content */}
          <div className="md:col-span-9 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Avatar uniforme (pas d’anneau) */}
                <div
                  className={`relative h-24 w-24 shrink-0 rounded-full flex items-center justify-center ${
                    hasIconPreset
                      ? `bg-gradient-to-br ${getAvatarColor()}`
                      : "bg-gradient-to-br from-fuchsia-500 to-violet-600"
                  }`}
                >
                  {getAvatarIcon()}
                  <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white dark:border-black" />
                </div>

                {/* User names */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-semibold text-black dark:text-white">
                      {user.displayName}
                    </h1>
                  </div>
                  <p className="text-sm font-medium">@{user.username}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to="/profil/edition"
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-medium transition shadow-sm"
                >
                  <Pencil size={14} />
                  Modifier le profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-600/10 dark:hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600/20 px-4 py-2 rounded-lg text-xs font-medium transition shadow-sm"
                >
                  <LogOut size={14} />
                  Se déconnecter
                </button>
              </div>
            </div>

            {/* Favoris */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                  <Heart size={14} className="text-red-500" />
                  Favoris Récents
                </h2>
                <Link
                  to="/favoris"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
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
                <h2 className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                  <List size={14} className="text-blue-400" />
                  Listes Récentes
                </h2>
                <Link
                  to="/ma-liste"
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
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
