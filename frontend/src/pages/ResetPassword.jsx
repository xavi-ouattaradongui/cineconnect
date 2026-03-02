import { useState, useEffect } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";
import Loader from "../components/shared/Loader";
import ThemeToggle from "../components/shared/ThemeToggle";

export default function ResetPassword() {
  const search = useSearch({ from: "/reset-password" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();

  const token = search.token || "";

  useEffect(() => {
    // Vérifier que le token est présent dans l'URL
    if (!token) {
      setError("❌ Lien invalide ou expiré. Demandez un nouveau lien.");
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 3000);
    } catch (err) {
      setError(err.message || "Lien expiré ou invalide. Demandez un nouveau lien.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 py-12">
      {/* Bouton Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <g>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"></path>
                </g>
              </svg>
              <span className="text-2xl font-bold">CinéConnect</span>
            </div>
            <h1 className="text-3xl font-bold">Nouveau mot de passe</h1>
            <p className="text-gray-500 dark:text-gray-400">Créez votre nouveau mot de passe</p>
          </div>

          {!tokenValid ? (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <p className="text-red-700 dark:text-red-400 font-semibold">❌ Lien invalide</p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                  Le lien de réinitialisation est expiré ou invalide.
                </p>
              </div>

              <a
                href="/forgot-password"
                className="block w-full text-center py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Demander un nouveau lien
              </a>

              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Retour à la connexion
                </a>
              </p>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <p className="text-green-700 dark:text-green-400 font-semibold">✅ Mot de passe réinitialisé!</p>
                <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Redirection vers la connexion dans 3 secondes...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer mot de passe</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader />}
                {loading ? "Traitement..." : "Réinitialiser mot de passe"}
              </button>

              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Pas de lien?{" "}
                <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Demander un nouveau
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
