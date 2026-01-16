import { Link } from "@tanstack/react-router";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav className="w-full px-10 py-4 flex items-center justify-between bg-black/70 backdrop-blur-md fixed top-0 z-50 border-b border-white/10">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide text-red-500">
        CinéConnect
      </Link>

      {/* Barre de recherche */}
      <div className="w-1/3">
        <SearchBar />
      </div>

      {/* Icônes à droite */}
      <div className="flex items-center gap-6 text-white">
        <button className="hover:text-red-500 transition">Favoris</button>
        <button className="hover:text-red-500 transition">Profil</button>
      </div>
    </nav>
  );
}
