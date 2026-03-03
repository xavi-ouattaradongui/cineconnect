import { useState } from "react";
import {
  TrendingUp,
  Sparkles,
  Eye,
  Heart,
  Film,
  Trophy,
  ThumbsUp,
  Compass,
  Shuffle,
  Globe,
  Zap,
} from "lucide-react";

const sections = [
  {
    id: "trending",
    label: "Tendances",
    icon: <TrendingUp size={20} />,
  },
  {
    id: "new",
    label: "Nouveautés",
    icon: <Sparkles size={20} />,
  },
  {
    id: "popular",
    label: "Les plus vus",
    icon: <Eye size={20} />,
  },
  {
    id: "recommended",
    label: "Recommandés pour toi",
    icon: <Heart size={20} />,
  },
  {
    id: "family",
    label: "Films familiaux",
    icon: <Film size={20} />,
  },
  {
    id: "top10",
    label: "Top 10",
    icon: <Trophy size={20} />,
  },
  {
    id: "mostLiked",
    label: "Les plus aimés",
    icon: <ThumbsUp size={20} />,
  },
  {
    id: "discover",
    label: "À découvrir",
    icon: <Compass size={20} />,
  },
  {
    id: "random",
    label: "Suggestion aléatoire",
    icon: <Shuffle size={20} />,
  },
  {
    id: "international",
    label: "Cinéma international",
    icon: <Globe size={20} />,
  },
  {
    id: "actionNonStop",
    label: "Action non-stop",
    icon: <Zap size={20} />,
  },
];

export default function HomeSections({ 
  selectedSection, 
  onSelectSection 
}) {
  const buttonClass = (isSelected) => `
    whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full 
    font-semibold transition-all text-sm shrink-0 
    ${
      isSelected
        ? "bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-lg"
        : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/10"
    }
  `;

  return (
    <section className="w-full space-y-4 mb-8 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-10">
        <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 shrink-0">
          Explorez
        </h3>
      </div>

      <div className="relative overflow-hidden">
        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-container {
            animation: scroll-left 30s linear infinite;
          }
          .scroll-container:hover {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="flex gap-3 scroll-container px-10">
          {/* Première série de sections */}
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={buttonClass(selectedSection === section.id)}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
          {/* Duplication pour l'effet de boucle infinie */}
          {sections.map((section) => (
            <button
              key={`${section.id}-duplicate`}
              onClick={() => onSelectSection(section.id)}
              className={buttonClass(selectedSection === section.id)}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
