import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const router = useRouter();
  const { register } = useAuth();

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password)
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Vérifier la force du mot de passe
    if (!passwordStrength.minLength || !passwordStrength.hasUpperCase || 
        !passwordStrength.hasNumber || !passwordStrength.hasSpecialChar) {
      setError("Le mot de passe ne respecte pas tous les critères de sécurité");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: username,
        email: email,
        password: password,
        displayName: displayName || username,
      });

      router.navigate({ to: "/" });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
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
          <h1 className="text-3xl font-bold">S'inscrire</h1>
          <p className="text-gray-500 dark:text-gray-400">Créez votre compte</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom d'affichage
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 text-sm">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jean_dupont21"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-8 pr-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicators */}
            {password && (
              <div className="mt-2 space-y-1.5 text-xs">
                <div className={`flex items-center gap-2 ${passwordStrength.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  <span>{passwordStrength.minLength ? '✓' : '○'}</span>
                  <span>Au moins 8 caractères</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordStrength.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  <span>{passwordStrength.hasUpperCase ? '✓' : '○'}</span>
                  <span>Une lettre majuscule</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordStrength.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  <span>{passwordStrength.hasNumber ? '✓' : '○'}</span>
                  <span>Un chiffre</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordStrength.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                  <span>{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                  <span>Un caractère spécial (@$!%*?&)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="rounded w-4 h-4" required />
            <span className="text-gray-600 dark:text-gray-400">
              J'accepte les{" "}
              <Link to="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                conditions d'utilisation
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
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

        {/* Login Link */}
        <p className="text-center text-gray-600 dark:text-gray-400">
          Déjà inscrit?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
