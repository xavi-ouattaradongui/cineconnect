import { useState } from "react";
import SettingsSidebar from "../components/profile/SettingsSidebar";
import SecurityForm from "../components/profile/SecurityForm";

export default function ProfileSecurity() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

            <SecurityForm
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleSavePassword}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
