import { useState } from "react";
import { Link, useRouter, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({
        email: emailOrUsername,
        password: password,
      });

      navigate({ to: "/home" });
    } catch (err) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
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
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-gray-500 dark:text-gray-400">Accédez à votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email or Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email ou nom d'utilisateur
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500">
                {emailOrUsername.includes("@") ? <Mail size={16} /> : <User size={16} />}
              </div>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="exemple@email.com ou votre_nom"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded w-4 h-4" />
              <span className="text-gray-600 dark:text-gray-400">Se souvenir de moi</span>
            </label>
            <Link
              to="#"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition"
            >
              Mot de passe oublié?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-gray-500">Ou</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          Pas encore de compte?{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
