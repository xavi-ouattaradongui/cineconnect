import { Link } from "@tanstack/react-router";
import PasswordInput from "./PasswordInput";

export default function SecurityForm({ form, onFormChange, onSubmit, isLoading, passwordStrength }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <PasswordInput
        label="Mot de passe actuel"
        value={form.currentPassword}
        onChange={(e) => onFormChange("currentPassword", e.target.value)}
        placeholder="Entrez votre mot de passe actuel"
      />

      <div className="border-t border-gray-200 dark:border-white/10 pt-6" />

      <div className="space-y-2">
        <PasswordInput
          label="Nouveau mot de passe"
          value={form.newPassword}
          onChange={(e) => onFormChange("newPassword", e.target.value)}
          placeholder="Entrez votre nouveau mot de passe"
        />

        {/* Password Strength Indicators */}
        {form.newPassword && passwordStrength && (
          <div className="mt-3 space-y-1.5 text-xs pl-1">
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

      <PasswordInput
        label="Confirmer le nouveau mot de passe"
        value={form.confirmPassword}
        onChange={(e) => onFormChange("confirmPassword", e.target.value)}
        placeholder="Confirmez votre nouveau mot de passe"
      />

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
          disabled={isLoading}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Modification en cours..." : "Mettre à jour le mot de passe"}
        </button>
      </div>
    </form>
  );
}
