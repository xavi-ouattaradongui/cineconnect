import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSearchMovies } from "../hooks/useMovies";

export default function Navbar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { location } = useRouterState();

  // Synchronise l’input avec ?q
  useEffect(() => {
    setSearchValue(location.search?.q || "");
  }, [location.search?.q]);

  // Recherche dès la 1ère lettre
  const { data, isLoading } = useSearchMovies(searchValue);
  const suggestions = data?.Search?.slice(0, 5) || [];
  const showDropdown = isFocused && searchValue.length > 0;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    router.navigate({
      to: "/",
      search: (prev) => ({ ...prev, q: value || undefined }),
    });
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tighter text-white flex items-center gap-2 hover:text-red-600 transition-colors"
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
              to="/"
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              Découvrir
            </Link>
            <Link
              to="/ma-liste"
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              Ma Liste
            </Link>
            <Link
              to="/favoris"
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              Favoris
            </Link>
          </div>
        </div>

        {/* SEARCH & PROFILE */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="hidden sm:flex items-center bg-white/5 border border-white/5 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-white/20 transition-all relative">
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
              className="bg-transparent border-none outline-none text-sm text-white ml-2 placeholder:text-gray-500 w-48"
            />
            <div className="text-[10px] border border-white/10 rounded px-1 text-gray-500">
              ⌘K
            </div>

            {/* Suggestions */}
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
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
                        <div className="text-sm text-white line-clamp-1">
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
          <button className="relative group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-[1px]">
              <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-medium text-white group-hover:bg-transparent transition-all">
                JD
              </div>
            </div>
            <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-black"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}
