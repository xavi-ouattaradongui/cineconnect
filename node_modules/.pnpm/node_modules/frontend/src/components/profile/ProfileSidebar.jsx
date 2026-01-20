import { Link } from "@tanstack/react-router";
import { List, Heart } from "lucide-react";

export default function ProfileSidebar() {
  return (
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
  );
}
