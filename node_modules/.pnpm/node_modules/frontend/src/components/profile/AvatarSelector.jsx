import { Check } from "lucide-react";
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
} from "lucide-react";

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

export default function AvatarSelector({ selectedAvatar, onSelectAvatar, previewIcon, previewColor, displayName }) {
  return (
    <>
      {/* Avatar Preview */}
      <div className="flex items-center gap-6">
        <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${previewColor} flex items-center justify-center`}>
          {previewIcon}
        </div>
        <div>
          <p className="text-sm font-medium text-black dark:text-white">Avatar actuel</p>
          <p className="text-xs text-gray-500">Choisissez un avatar ci-dessous</p>
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
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectAvatar(preset.id)}
                className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center ${
                  selectedAvatar === preset.id
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                }`}
                title={preset.label}
              >
                <div className={`w-full h-full rounded-lg bg-gradient-to-br ${preset.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                {selectedAvatar === preset.id && (
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
