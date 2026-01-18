import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Shield, Camera, Mail } from "lucide-react";

export default function ProfileEdit() {
  const [form, setForm] = useState({
    displayName: "Jean Dupont",
    username: "jeandupont",
    email: "jean.dupont@example.com",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-black text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <Link
              to="/profil/edition"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-white/5 rounded-lg border border-white/5 transition"
            >
              <User size={16} className="text-indigo-400" />
              Général
            </Link>
            <Link
              to="/profil/securite"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <Shield size={16} />
              Sécurité
            </Link>
          </aside>

          {/* Form */}
          <div className="md:col-span-9 space-y-10">
            <div className="border-b border-white/5 pb-8">
              <h1 className="text-2xl font-medium text-white">Paramètres généraux</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos informations personnelles et préférences de profil.
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover border-2 border-black"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white text-black p-1.5 rounded-full shadow-lg hover:bg-gray-200 transition-colors border border-black">
                  <Camera size={12} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2 rounded-md text-xs font-medium transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    Changer l'avatar
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-xs font-medium px-2 transition-colors">
                    Supprimer
                  </button>
                </div>
                <p className="text-xs text-gray-500">Recommandé: 400x400px. JPG, PNG ou GIF.</p>
              </div>
            </div>

            {/* Form fields */}
            <form className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                    Nom d'affichage
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={handleChange("displayName")}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                      cineconnect.com/
                    </span>
                    <input
                      type="text"
                      value={form.username}
                      onChange={handleChange("username")}
                      className="w-full bg-transparent border border-white/10 rounded-lg pl-[130px] pr-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full bg-transparent border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                  />
                </div>
              </div>
            </form>

            {/* Footer actions */}
            <div className="pt-6 flex items-center justify-end gap-4">
              <Link to="/profil" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                Annuler
              </Link>
              <button className="bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
