import { Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function ProfileEditForm({ form, onFormChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Name */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
            Nom d'affichage
          </label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => onFormChange("displayName", e.target.value)}
            className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
              @
            </span>
            <input
              type="text"
              value={form.username}
              onChange={(e) => onFormChange("username", e.target.value)}
              className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
          Email
        </label>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => onFormChange("email", e.target.value)}
            className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="pt-6 flex items-center justify-end gap-4">
        <Link 
          to="/profil" 
          className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
