import { Link } from "@tanstack/react-router";
import { User, Shield } from "lucide-react";

export default function SettingsSidebar({ activeTab }) {
  return (
    <aside className="md:col-span-3 space-y-1">
      <Link
        to="/profil/edition"
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
          activeTab === "general"
            ? "text-black dark:text-white bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5"
            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        }`}
      >
        <User size={16} />
        Général
      </Link>
      <Link
        to="/profil/securite"
        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
          activeTab === "security"
            ? "text-black dark:text-white bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5"
            : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        }`}
      >
        <Shield size={16} />
        Sécurité
      </Link>
    </aside>
  );
}
