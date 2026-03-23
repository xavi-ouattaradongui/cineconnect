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

export default function AvatarBubble({ avatar, initials, size = 24 }) {
  const Icon = AVATAR_ICONS[avatar];
  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/80 shrink-0"
      style={{ width: size, height: size }}
      title={initials}
    >
      {Icon ? (
        <Icon size={Math.max(12, Math.floor(size * 0.6))} />
      ) : (
        <span className="text-[10px] leading-none">{initials || "?"}</span>
      )}
    </div>
  );
}
