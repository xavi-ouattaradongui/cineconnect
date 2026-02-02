import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { User, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AvatarSelector from "../components/profile/AvatarSelector";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import SettingsSidebar from "../components/profile/SettingsSidebar";
import {
  Skull,
  Ghost,
  Zap,
  Heart,
  Star,
  Flame,
  Crown,
  Swords,
  Sparkles,
  Moon,
  Sun,
  Camera,
  Rocket,
  Coffee,
  Music,
  Gamepad,
  Pizza,
  Trophy,
  Diamond,
  Eye,
  Smile,
  Angry,
  Target,
  Compass,
  Feather,
} from "lucide-react";

const AVATAR_ICONS = {
  skull: Skull,
  ghost: Ghost,
  zap: Zap,
  heart: Heart,
  star: Star,
  flame: Flame,
  crown: Crown,
  swords: Swords,
  sparkles: Sparkles,
  moon: Moon,
  sun: Sun,
  camera: Camera,
  rocket: Rocket,
  coffee: Coffee,
  music: Music,
  gamepad: Gamepad,
  pizza: Pizza,
  trophy: Trophy,
  diamond: Diamond,
  eye: Eye,
  smile: Smile,
  angry: Angry,
  target: Target,
  compass: Compass,
  feather: Feather,
};

const AVATAR_COLORS = {
  skull: "from-gray-500 to-gray-700",
  ghost: "from-purple-500 to-indigo-600",
  zap: "from-yellow-500 to-orange-600",
  heart: "from-pink-500 to-red-600",
  star: "from-yellow-400 to-amber-600",
  flame: "from-orange-500 to-red-600",
  crown: "from-yellow-500 to-yellow-600",
  swords: "from-gray-400 to-gray-600",
  sparkles: "from-cyan-400 to-blue-600",
  moon: "from-indigo-400 to-purple-600",
  sun: "from-yellow-400 to-orange-500",
  camera: "from-gray-500 to-slate-700",
  rocket: "from-blue-500 to-cyan-600",
  coffee: "from-amber-700 to-brown-800",
  music: "from-purple-400 to-pink-500",
  gamepad: "from-green-500 to-teal-600",
  pizza: "from-red-500 to-orange-600",
  trophy: "from-yellow-600 to-amber-700",
  diamond: "from-cyan-300 to-blue-500",
  eye: "from-indigo-500 to-purple-600",
  smile: "from-yellow-300 to-orange-400",
  angry: "from-red-600 to-orange-700",
  target: "from-red-500 to-pink-600",
  compass: "from-blue-600 to-indigo-700",
  feather: "from-teal-400 to-cyan-500",
};

export default function ProfileEdit() {
  const { user, updateProfile, refreshProfile } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    email: "",
  });
  const [avatar, setAvatar] = useState("skull");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || user.username || "",
        username: user.username || "",
        email: user.email || "",
      });
      // Si avatar est null ou undefined, garder null pour les initiales
      setAvatar(user.avatar || null);
    }
  }, [user]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAvatar = (avatarId) => {
    setAvatar(avatarId);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await updateProfile({
        username: form.username,
        email: form.email,
        displayName: form.displayName,
        avatar: avatar,
      });

      // Rafraîchir le profil pour mettre à jour tous les composants
      await refreshProfile();

      setSuccess("Profil mis à jour avec succès !");
      
      setTimeout(() => {
        router.navigate({ to: "/profil" });
      }, 1500);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (displayName) => {
    if (!displayName) return "U";
    
    // Gérer les noms avec espaces, underscores ou tirets
    const parts = displayName.split(/[\s_-]+/);
    
    if (parts.length > 1) {
      return parts
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    
    // Sinon, prendre les 2 premières lettres
    return displayName.slice(0, 2).toUpperCase();
  };

  const getAvatarIcon = () => {
    const Icon = AVATAR_ICONS[avatar];
    if (Icon && avatar !== null) {
      return <Icon size={32} className="text-white" />;
    }
    // Afficher les initiales si avatar est null
    return <span className="text-2xl font-semibold text-white">{getInitials(form.displayName)}</span>;
  };

  const getAvatarColor = () => {
    if (avatar === null) {
      return "from-indigo-500 to-purple-600"; // Couleur pour les initiales
    }
    return AVATAR_COLORS[avatar] || "from-indigo-500 to-purple-600";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-600 dark:text-gray-400">
      <div className="h-16" />
      <main className="max-w-6xl mx-auto pt-12 px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <SettingsSidebar activeTab="general" />

          {/* Form */}
          <div className="md:col-span-9 space-y-10">
            <div className="border-b border-gray-200 dark:border-white/5 pb-8">
              <h1 className="text-2xl font-medium text-black dark:text-white">
                Paramètres généraux
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos informations personnelles et préférences de profil.
              </p>
            </div>

            {/* Avatar Selector */}
            <AvatarSelector
              selectedAvatar={avatar}
              onSelectAvatar={handleSelectAvatar}
              previewIcon={getAvatarIcon()}
              previewColor={getAvatarColor()}
              displayName={form.displayName}
            />

            {/* Edit Form */}
            <ProfileEditForm
              form={form}
              onFormChange={handleFormChange}
              onSubmit={handleSaveProfile}
            />

            {/* Messages d'erreur et succès */}
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
          </div>
        </div>
      </main>
    </div>
  );
}
