import { useQuery } from "@tanstack/react-query";
import {
  searchMoviesMultiTerms,
} from "../api/omdb";

export const useSectionMovies = (section) => {
  const sectionConfig = {
    trending: {
      enabled: true,
      queryFn: async () => {
        const trendingTerms = [
          "avengers",
          "inception",
          "oppenheimer",
          "killers of the flower moon",
          "barbie",
          "dune",
        ];
        const data = await searchMoviesMultiTerms(trendingTerms, 1);
        return data;
      },
    },
    new: {
      enabled: true,
      queryFn: async () => {
        const newTerms = [
          "2025",
          "2024",
          "latest",
          "new release",
          "premiere",
        ];
        const data = await searchMoviesMultiTerms(newTerms, 1);
        return data;
      },
    },
    popular: {
      enabled: true,
      queryFn: async () => {
        const popularTerms = [
          "marvel",
          "action",
          "blockbuster",
          "avatar",
          "mission impossible",
          "fast furious",
        ];
        const data = await searchMoviesMultiTerms(popularTerms, 1);
        return data;
      },
    },
    recommended: {
      enabled: true,
      queryFn: async () => {
        const recommendedTerms = [
          "drama",
          "thriller",
          "comedy",
          "adventure",
          "mystery",
          "crime",
        ];
        const data = await searchMoviesMultiTerms(recommendedTerms, 1);
        return data;
      },
    },
    family: {
      enabled: true,
      queryFn: async () => {
        const familyTerms = [
          "animation",
          "frozen",
          "lion king",
          "toy story",
          "pixar",
          "family adventure",
        ];
        const data = await searchMoviesMultiTerms(familyTerms, 1);
        return data;
      },
    },
    mustWatch: {
      enabled: true,
      queryFn: async () => {
        const mustWatchTerms = [
          "masterpiece",
          "award",
          "best film",
          "shawshank",
          "godfather",
          "pulp fiction",
        ];
        const data = await searchMoviesMultiTerms(mustWatchTerms, 1);
        return data;
      },
    },
    comedy: {
      enabled: true,
      queryFn: async () => {
        const comedyTerms = [
          "comedy",
          "funny",
          "laugh",
          "romantic comedy",
          "sitcom",
          "feel good",
        ];
        const data = await searchMoviesMultiTerms(comedyTerms, 1);
        return data;
      },
    },
    discover: {
      enabled: true,
      queryFn: async () => {
        const discoverTerms = [
          "indie",
          "cult",
          "hidden gem",
          "underrated",
          "art film",
          "festival",
        ];
        const data = await searchMoviesMultiTerms(discoverTerms, 1);
        return data;
      },
    },
    thriller: {
      enabled: true,
      queryFn: async () => {
        const thrillerTerms = [
          "thriller",
          "suspense",
          "murder mystery",
          "psychological thriller",
          "crime thriller",
          "noir",
        ];
        const data = await searchMoviesMultiTerms(thrillerTerms, 1);
        return data;
      },
    },
    sciFi: {
      enabled: true,
      queryFn: async () => {
        const sciFiTerms = [
          "sci-fi",
          "science fiction",
          "space",
          "future",
          "cyberpunk",
          "dystopia",
        ];
        const data = await searchMoviesMultiTerms(sciFiTerms, 1);
        return data;
      },
    },
    futuristicSciFi: {
      enabled: true,
      queryFn: async () => {
        const futuristicSciFiTerms = [
          "future city",
          "cyberpunk",
          "ai",
          "android",
          "time travel",
          "utopia",
        ];
        const data = await searchMoviesMultiTerms(futuristicSciFiTerms, 1);
        return data;
      },
    },
    alienSciFi: {
      enabled: true,
      queryFn: async () => {
        const alienSciFiTerms = [
          "alien",
          "extraterrestrial",
          "ufo",
          "space invasion",
          "contact",
          "xenomorph",
        ];
        const data = await searchMoviesMultiTerms(alienSciFiTerms, 1);
        return data;
      },
    },
    international: {
      enabled: true,
      queryFn: async () => {
        const internationalTerms = [
          "foreign",
          "international",
          "world cinema",
          "bollywood",
          "korean",
          "japanese",
        ];
        const data = await searchMoviesMultiTerms(internationalTerms, 1);
        return data;
      },
    },
    anime: {
      enabled: true,
      queryFn: async () => {
        const animeTerms = [
          "anime",
          "studio ghibli",
          "japanese animation",
          "shonen",
          "manga adaptation",
          "otaku",
        ];
        const data = await searchMoviesMultiTerms(animeTerms, 1);
        return data;
      },
    },
    actionNonStop: {
      enabled: true,
      queryFn: async () => {
        const actionTerms = [
          "explosion",
          "fight",
          "chase",
          "action",
          "combat",
          "adrenaline",
        ];
        const data = await searchMoviesMultiTerms(actionTerms, 1);
        return data;
      },
    },
  };

  const config = sectionConfig[section];

  return useQuery({
    queryKey: ["section-movies", section],
    queryFn: config?.queryFn || (() => ({ Search: [] })),
    enabled: config?.enabled ?? false,
    staleTime: 1000 * 60 * 10,
  });
};
