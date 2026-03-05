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
  ChevronRight,
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
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="w-full mb-8 mt-10">
      {!showAll ? (
        // Affichage des 5 premiers + bouton Plus
        <div className="flex gap-8 px-10 items-center">
          {sections.slice(0, 5).map((section) => (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className="whitespace-nowrap flex flex-row items-center gap-2 shrink-0 cursor-pointer"
            >
              <div className="text-2xl">
                {section.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {section.label}
              </span>
            </div>
          ))}
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Plus
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        // Affichage avec animation de tous les éléments
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
          
          <div className="flex gap-8 scroll-container px-10">
            {/* Première série de sections */}
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className="whitespace-nowrap flex flex-row items-center gap-2 shrink-0 cursor-pointer"
              >
                <div className="text-2xl">
                  {section.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {section.label}
                </span>
              </div>
            ))}
            {/* Duplication pour l'effet de boucle infinie */}
            {sections.map((section) => (
              <div
                key={`${section.id}-duplicate`}
                onClick={() => onSelectSection(section.id)}
                className="whitespace-nowrap flex flex-row items-center gap-2 shrink-0 cursor-pointer"
              >
                <div className="text-2xl">
                  {section.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {section.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
