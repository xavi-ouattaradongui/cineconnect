import { Check, User } from "lucide-react";
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

const AVATAR_PRESETS = [
  { id: null, icon: User, label: "Initiales", color: "from-indigo-500 to-purple-600" }, // Option par défaut
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
  { id: "rocket", icon: Rocket, label: "Rocket", color: "from-blue-500 to-cyan-600" },
  { id: "coffee", icon: Coffee, label: "Coffee", color: "from-amber-700 to-brown-800" },
  { id: "music", icon: Music, label: "Music", color: "from-purple-400 to-pink-500" },
  { id: "gamepad", icon: Gamepad, label: "Gaming", color: "from-green-500 to-teal-600" },
  { id: "pizza", icon: Pizza, label: "Pizza", color: "from-red-500 to-orange-600" },
  { id: "trophy", icon: Trophy, label: "Trophy", color: "from-yellow-600 to-amber-700" },
  { id: "diamond", icon: Diamond, label: "Diamond", color: "from-cyan-300 to-blue-500" },
  { id: "eye", icon: Eye, label: "Eye", color: "from-indigo-500 to-purple-600" },
  { id: "smile", icon: Smile, label: "Smile", color: "from-yellow-300 to-orange-400" },
  { id: "angry", icon: Angry, label: "Angry", color: "from-red-600 to-orange-700" },
  { id: "target", icon: Target, label: "Target", color: "from-red-500 to-pink-600" },
  { id: "compass", icon: Compass, label: "Compass", color: "from-blue-600 to-indigo-700" },
  { id: "feather", icon: Feather, label: "Feather", color: "from-teal-400 to-cyan-500" },
];

export default function AvatarSelector({ selectedAvatar, onSelectAvatar, previewIcon, previewColor, displayName }) {
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(/[\s_-]+/);
    if (parts.length > 1) {
      return parts.map((part) => part[0]).join("").toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${previewColor} flex items-center justify-center`}>
          {previewIcon}
        </div>
        <div>
          <p className="text-sm font-medium text-black dark:text-white">Avatar actuel</p>
          <p className="text-xs text-gray-500">
            {selectedAvatar ? "Icône personnalisée" : "Initiales par défaut"}
          </p>
        </div>
      </div>

      {/* Avatar Gallery */}
      <div>
        <h3 className="text-sm font-medium text-black dark:text-white uppercase tracking-wider mb-4">
          Choisir un avatar
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {AVATAR_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedAvatar === preset.id;

            return (
              <button
                key={preset.id || "initials"}
                type="button"
                onClick={() => onSelectAvatar(preset.id)}
                className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                }`}
                title={preset.label}
              >
                <div className={`w-full h-full rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
                  {preset.id === null ? (
                    <span className="text-white font-bold text-lg">{getInitials(displayName)}</span>
                  ) : (
                    <Icon size={24} className="text-white" />
                  )}
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
