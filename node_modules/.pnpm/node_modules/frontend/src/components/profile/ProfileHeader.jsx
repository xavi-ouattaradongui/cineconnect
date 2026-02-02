import { Link } from "@tanstack/react-router";
import { Pencil, LogOut } from "lucide-react";
import {
  Skull,
  Ghost,
  Zap,
  Flame,
  Crown,
  Swords,
  Sparkles,
  Moon,
  Sun,
  Camera,
  Heart,
  Star,
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
};

export default function ProfileHeader({ user, onLogout }) {
  const getInitials = (name) => {
    if (!name) return "U";

    // Gérer les noms avec espaces, underscores ou tirets
    const parts = name.split(/[\s_-]+/);

    if (parts.length > 1) {
      // Prendre la première lettre de chaque partie
      return (
        parts
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      );
    }

    // Sinon, prendre les 2 premières lettres
    return name.slice(0, 2).toUpperCase();
  };

  const getAvatarIcon = () => {
    const avatarKey = user?.avatar || "skull";
    const Icon = AVATAR_ICONS[avatarKey] || Skull;
    const colorClass = AVATAR_COLORS[avatarKey] || AVATAR_COLORS.skull;

    return (
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}
      >
        <Icon size={40} className="text-white" />
      </div>
    );
  };

  const getAvatarColor = () => {
    return AVATAR_COLORS[user.avatar] || "from-red-500 to-purple-600";
  };

  const hasIconPreset = !!AVATAR_ICONS[user.avatar];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div
          className={`relative h-24 w-24 shrink-0 rounded-full flex items-center justify-center ${
            hasIconPreset
              ? `bg-gradient-to-br ${getAvatarColor()}`
              : "bg-gradient-to-br from-fuchsia-500 to-violet-600"
          }`}
        >
          {getAvatarIcon()}
          <div className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white dark:border-black" />
        </div>

        {/* User names */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold text-black dark:text-white">
              {user.displayName}
            </h1>
          </div>
          <p className="text-sm font-medium">@{user.username}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to="/profil/edition"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-medium transition shadow-sm"
        >
          <Pencil size={14} />
          Modifier le profil
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-600/10 dark:hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-600/20 px-4 py-2 rounded-lg text-xs font-medium transition shadow-sm"
        >
          <LogOut size={14} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
