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
    <div className="min-h-screen bg-black text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="md:col-span-3 space-y-1">
            <Link
              to="/profil/edition"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition w-full text-left"
            >
              <User size={16} />
              Général
            </Link>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-white/5 rounded-lg border border-white/5 transition w-full text-left">
              <Shield size={16} className="text-indigo-400" />
              Sécurité
            </button>
          </aside>

          {/* Form */}
          <div className="md:col-span-9 space-y-10">
            <div className="border-b border-white/5 pb-8">
              <h1 className="text-2xl font-medium text-white">Paramètres de sécurité</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos mots de passe et vos paramètres de sécurité.
              </p>
            </div>

            {/* Change Password */}
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
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6" />

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial.
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
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-6 flex items-center justify-end gap-4">
                <Link
                  to="/profil"
                  className="text-sm font-medium text-gray-500 hover:text-white transition-colors"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Enregistrer le nouveau mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
