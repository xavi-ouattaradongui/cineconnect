import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../services/api";
import Loader from "../components/shared/Loader";
import ThemeToggle from "../components/shared/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.forgotPassword(email);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 5000);
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
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

      <div className="w-full max-w-md rounded-3xl border-2 border-blue-700/70 bg-white px-8 py-8 shadow-2xl shadow-black/20 ring-1 ring-blue-700/25 dark:border-blue-600/70 dark:bg-black dark:shadow-black/60">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
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
            </Link>
            <h1 className="text-3xl font-bold">Réinitialiser mot de passe</h1>
            <p className="text-gray-500 dark:text-gray-400">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <p className="text-green-700 dark:text-green-400 font-semibold mb-2">✅ Email envoyé!</p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Vérifiez votre boîte mail (et le dossier spam). Vous avez reçu un lien de réinitialisation.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Redirection vers la connexion dans 5 secondes...
                </p>
              </div>

              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Retour à la connexion
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader />}
                {loading ? "Envoi..." : "Envoyer lien de réinitialisation"}
              </button>

              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Retour à la connexion
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
