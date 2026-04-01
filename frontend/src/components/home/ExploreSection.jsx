import { useNavigate } from "@tanstack/react-router";
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
    label: "On pense que vous allez adorer",
    icon: <TrendingUp size={20} />,
  },
  {
    id: "recommended",
    label: "Trouvez votre prochain coup de cœur",
    icon: <Heart size={20} />,
  },
  {
    id: "discover",
    label: "Pépites pour vous",
    icon: <Compass size={20} />,
  },
  {
    id: "new",
    label: "Nouveautés",
    icon: <Sparkles size={20} />,
  },
  {
    id: "popular",
    label: "Grands succès",
    icon: <Eye size={20} />,
  },
  {
    id: "mustWatch",
    label: "À ne pas manquer",
    icon: <Trophy size={20} />,
  },
  {
    id: "actionNonStop",
    label: "Films d'action",
    icon: <Zap size={20} />,
  },
  {
    id: "comedy",
    label: "Comédies",
    icon: <ThumbsUp size={20} />,
  },
  {
    id: "thriller",
    label: "Thrillers",
    icon: <Shuffle size={20} />,
  },
  {
    id: "sciFi",
    label: "Films de science-fiction",
    icon: <Film size={20} />,
  },
  {
    id: "futuristicSciFi",
    label: "SF futuriste",
    icon: <Zap size={20} />,
  },
  {
    id: "alienSciFi",
    label: "Aliens et science-fiction",
    icon: <Globe size={20} />,
  },
  {
    id: "international",
    label: "Films internationaux",
    icon: <Globe size={20} />,
  },
  {
    id: "anime",
    label: "Anime japonais",
    icon: <Film size={20} />,
  },
  {
    id: "family",
    label: "À voir en famille",
    icon: <Heart size={20} />,
  },
];

export default function ExploreSection({ 
  selectedSection, 
  onSelectSection 
}) {
  const navigate = useNavigate();

  const handleSectionClick = (sectionId) => {
    navigate({ to: "/explorez/$section", params: { section: sectionId } });
  };

  return (
    <section className="w-full mb-8 mt-10 px-10">
      <h3 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-400 mb-4">
        Collection
      </h3>
      
      <div className="relative overflow-hidden">
        <style>{`
          @media (min-width: 768px) {
            @keyframes scroll-infinite {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .scroll-continuous {
              animation: scroll-infinite 40s linear infinite;
            }

            .scroll-continuous:hover {
              animation-play-state: paused;
            }
          }
        `}</style>
        
        <div className="flex gap-6 md:gap-8 items-center overflow-x-auto md:overflow-hidden scroll-smooth snap-x snap-mandatory md:snap-none scrollbar-hide scroll-continuous">
          {/* Première série */}
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="whitespace-nowrap flex flex-row items-center gap-2 shrink-0 snap-start cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="text-2xl group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {section.icon}
              </div>
              <span className="text-xs font-semibold">
                {section.label}
              </span>
            </div>
          ))}
          {/* Deuxième série pour la continuité */}
          {sections.map((section) => (
            <div
              key={`${section.id}-duplicate`}
              onClick={() => handleSectionClick(section.id)}
              className="hidden md:flex whitespace-nowrap flex-row items-center gap-2 shrink-0 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="text-2xl group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {section.icon}
              </div>
              <span className="text-xs font-semibold">
                {section.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
