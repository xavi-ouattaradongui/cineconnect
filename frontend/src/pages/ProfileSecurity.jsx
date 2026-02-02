import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import SettingsSidebar from "../components/profile/SettingsSidebar";
import SecurityForm from "../components/profile/SecurityForm";

export default function ProfileSecurity() {
  const { changePassword } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password)
    });
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
    
    if (field === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (form.newPassword !== form.confirmPassword) {
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
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      setSuccess("Mot de passe modifié avec succès !");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength({ minLength: false, hasUpperCase: false, hasNumber: false, hasSpecialChar: false });
      
      setTimeout(() => {
        router.navigate({ to: "/profil" });
      }, 2000);
    } catch (err) {
      setError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <SettingsSidebar activeTab="security" />

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

            {/* Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <SecurityForm
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleSavePassword}
              isLoading={isLoading}
              passwordStrength={passwordStrength}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
