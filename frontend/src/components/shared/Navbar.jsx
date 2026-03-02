import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useSearchMovies } from "../../hooks/useMovies";
import { useCategories } from "../../hooks/useCategories";
import { useAuth } from "../../contexts/AuthContext";
import {
  Skull,
  Ghost,
  Zap,
  Heart,
  Star,
  Flame,
  Crown,
  Swords,
  Sparkles,
  Camera,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";

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
  camera: "from-gray-500 to-slate-700",
};

export default function Navbar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const categoriesRef = useRef(null);
  const router = useRouter();
  const { location } = useRouterState();
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.body.classList.toggle("dark", shouldUseDark);
    document.getElementById("root")?.classList.toggle("dark", shouldUseDark);
  }, []);

  // Synchronise l'input avec ?q UNIQUEMENT sur la page d'accueil
  useEffect(() => {
    if (location.pathname === "/home") {
      setSearchValue(location.search?.q || "");
    }
  }, [location.search?.q, location.pathname]);

  // Recherche dès la 1ère lettre
  const { data, isLoading } = useSearchMovies(searchValue);
  const suggestions = data?.Search?.slice(0, 5) || [];
  const showDropdown = isFocused && searchValue.length > 0;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Naviguer seulement si on est sur la page d'accueil
    if (location.pathname === "/home") {
      router.navigate({
        to: "/home",
        search: (prev) => ({ ...prev, q: value || undefined }),
      });
    }

    if (onSearch) onSearch(value);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      document.body.classList.toggle("dark", next);
      document.getElementById("root")?.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const getAvatarIcon = () => {
    const avatarKey = user?.avatar;
    
    // Si l'utilisateur a choisi une icône
    if (avatarKey && AVATAR_ICONS[avatarKey]) {
      const Icon = AVATAR_ICONS[avatarKey];
      const colorClass = AVATAR_COLORS[avatarKey];
      
      return (
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
          <Icon size={16} className="text-white" />
        </div>
      );
    }
    
    // Sinon, afficher les initiales (par défaut)
    const name = user?.displayName || user?.username || "User";
    const parts = name.split(/[\s_-]+/);
    const initials = parts.length > 1
      ? parts.map(part => part[0]).join("").toUpperCase().slice(0, 2)
      : name.slice(0, 2).toUpperCase();
    
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <span className="text-sm font-medium text-white">{initials}</span>
      </div>
    );
  };

  const getAvatarColor = () => {
    if (!user) return "from-fuchsia-500 to-violet-600";
    return AVATAR_COLORS[user.avatar] || "from-fuchsia-500 to-violet-600";
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link
            to="/home"
            className="text-lg font-semibold tracking-tighter text-black dark:text-white flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"></path>
              </g>
            </svg>
            CinéConnect
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              to="/home"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Découvrir
            </Link>
            
            <Link
              to="/ma-liste"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Ma Liste
            </Link>
            
            {/* Dropdown Catégorie */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                Catégorie
                <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to="/categorie/$category"
                      params={{ category }}
                      onClick={() => setShowCategories(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH & PROFILE */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            title={isDarkMode ? "Mode clair" : "Mode sombre"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {/* SEARCH */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-white/20 transition-all relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <g>
                <path d="m21 21l-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </g>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={searchValue}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              className="bg-transparent border-none outline-none text-sm text-black dark:text-white ml-2 placeholder:text-gray-500 w-48"
            />
            <div className="text-[10px] border border-gray-300 dark:border-white/10 rounded px-1 text-gray-500">
              ⌘K
            </div>

            {/* Suggestions */}
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden">
                {isLoading ? (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    Recherche...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((m) => (
                    <Link
                      key={m.imdbID}
                      to={`/film/${m.imdbID}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors"
                    >
                      <img
                        src={m.Poster}
                        alt={m.Title}
                        className="h-10 w-7 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-1">
                          {m.Title}
                        </div>
                        <div className="text-xs text-gray-500">{m.Year}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    Aucun résultat
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <Link to="/profil" className="relative group">
            <div
              className={`h-8 w-8 rounded-full bg-gradient-to-br ${getAvatarColor()} p-[1px]`}
            >
              <div
                className={`h-full w-full rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-xs font-medium group-hover:opacity-80 transition-all`}
              >
                {getAvatarIcon()}
              </div>
            </div>
            <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-black"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
