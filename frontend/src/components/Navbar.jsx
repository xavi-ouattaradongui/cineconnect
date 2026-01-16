import { Link } from "@tanstack/react-router";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Navbar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
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
              className="text-white hover:text-red-600 transition-colors"
            >
              Découvrir
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Ma Liste
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Communauté
            </Link>
          </div>
        </div>

        {/* SEARCH & PROFILE */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="hidden sm:flex items-center bg-white/5 border border-white/5 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-white/20 focus-within:border-white/20 transition-all">
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
              className="bg-transparent border-none outline-none text-sm text-white ml-2 placeholder:text-gray-500 w-48"
            />
            <div className="text-[10px] border border-white/10 rounded px-1 text-gray-500">
              ⌘K
            </div>
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
