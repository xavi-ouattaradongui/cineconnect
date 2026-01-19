import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, Shield, Eye, EyeOff } from "lucide-react";

export default function ProfileSecurity() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    alert("Mot de passe modifié avec succès");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <Link
              to="/profil/edition"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition"
            >
              <User size={16} />
              Général
            </Link>
            <Link
              to="/profil/securite"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5 transition"
            >
              <Shield size={16} className="text-indigo-400" />
              Sécurité
            </Link>
          </aside>

          {/* Form */}
          <div className="md:col-span-9 space-y-10">
            <div className="border-b border-gray-200 dark:border-white/5 pb-8">
              <h1 className="text-2xl font-medium text-black dark:text-white">
                Sécurité
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez votre mot de passe et vos paramètres de sécurité.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={handleChange("currentPassword")}
                    className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 pt-6" />

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 caractères, 1 majuscule, 1 chiffre et 1 caractère
                  spécial.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-10 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-black dark:hover:text-white transition"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
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
                  Mettre à jour le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
