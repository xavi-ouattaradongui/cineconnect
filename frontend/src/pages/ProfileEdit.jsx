import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { 
  User, 
  Shield, 
  Mail, 
  Check,
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
  Camera
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AVATAR_PRESETS = [
  { id: "skull", icon: Skull, label: "Skull", color: "from-gray-500 to-gray-700" },
  { id: "ghost", icon: Ghost, label: "Ghost", color: "from-purple-500 to-indigo-600" },
  { id: "zap", icon: Zap, label: "Thunder", color: "from-yellow-500 to-orange-600" },
  { id: "heart", icon: Heart, label: "Heart", color: "from-pink-500 to-red-600" },
  { id: "star", icon: Star, label: "Star", color: "from-yellow-400 to-amber-600" },
  { id: "flame", icon: Flame, label: "Fire", color: "from-orange-500 to-red-600" },
  { id: "crown", icon: Crown, label: "Crown", color: "from-yellow-500 to-yellow-600" },
  { id: "swords", icon: Swords, label: "Swords", color: "from-gray-400 to-gray-600" },
  { id: "sparkles", icon: Sparkles, label: "Magic", color: "from-cyan-400 to-blue-600" },
  { id: "moon", icon: Moon, label: "Moon", color: "from-indigo-400 to-purple-600" },
  { id: "sun", icon: Sun, label: "Sun", color: "from-yellow-400 to-orange-500" },
  { id: "camera", icon: Camera, label: "Cinema", color: "from-gray-500 to-slate-700" },
];

export default function ProfileEdit() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: user?.displayName || "Jean Dupont",
    username: user?.username || "jeandupont",
    email: user?.email || "jean.dupont@example.com",
  });
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelectAvatar = (preset) => {
    setSelectedPreset(preset.id);
    setAvatar(preset.id);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      displayName: form.displayName,
      username: form.username,
      email: form.email,
      avatar: avatar,
    };
    login(updatedUser);
    router.navigate({ to: "/profil" });
  };

  const getInitials = (displayName) => {
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarIcon = () => {
    const preset = AVATAR_PRESETS.find(p => p.id === avatar);
    if (preset) {
      const Icon = preset.icon;
      return <Icon size={32} className="text-white" />;
    }
    return <span className="text-3xl">{getInitials(form.displayName)}</span>;
  };

  const getAvatarColor = () => {
    const preset = AVATAR_PRESETS.find(p => p.id === avatar);
    return preset?.color || "from-indigo-500 to-purple-600";
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
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white bg-white/5 rounded-lg border border-white/5 transition"
            >
              <User size={16} className="text-indigo-400" />
              Général
            </Link>
            <Link
              to="/profil/securite"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            >
              <Shield size={16} />
              Sécurité
            </Link>
          </aside>

          {/* Form */}
          <div className="md:col-span-9 space-y-10">
            <div className="border-b border-white/5 pb-8">
              <h1 className="text-2xl font-medium text-white">Paramètres généraux</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gérez vos informations personnelles et préférences de profil.
              </p>
            </div>

            {/* Avatar Preview */}
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                <div className={`h-full w-full rounded-full bg-gradient-to-br ${getAvatarColor()} border-2 border-black flex items-center justify-center`}>
                  {getAvatarIcon()}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Avatar actuel</p>
                <p className="text-xs text-gray-500">Choisissez un avatar ci-dessous</p>
              </div>
            </div>

            {/* Avatar Gallery */}
            <div>
              <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">
                Choisir un avatar
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {AVATAR_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectAvatar(preset)}
                      className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center ${
                        selectedPreset === preset.id
                          ? "border-indigo-500 bg-indigo-500/20"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                      title={preset.label}
                    >
                      <div className={`w-full h-full rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      {selectedPreset === preset.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                    Nom d'affichage
                  </label>
                  <input
                    type="text"
                    value={form.displayName}
                    onChange={handleChange("displayName")}
                    className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={form.username}
                      onChange={handleChange("username")}
                      className="w-full bg-transparent border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full bg-transparent border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500/50 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="pt-6 flex items-center justify-end gap-4">
                <Link to="/profil" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
                  Annuler
                </Link>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
