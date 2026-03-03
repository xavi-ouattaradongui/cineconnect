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
    top10: {
      enabled: true,
      queryFn: async () => {
        const topTerms = [
          "masterpiece",
          "award",
          "best film",
          "shawshank",
          "godfather",
          "pulp fiction",
        ];
        const data = await searchMoviesMultiTerms(topTerms, 1);
        return data;
      },
    },
    mostLiked: {
      enabled: true,
      queryFn: async () => {
        const mostLikedTerms = [
          "romance",
          "love",
          "heartwarming",
          "romantic comedy",
          "feel good",
          "beloved",
        ];
        const data = await searchMoviesMultiTerms(mostLikedTerms, 1);
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
    random: {
      enabled: true,
      queryFn: async () => {
        const randomTerms = [
          "adventure",
          "comedy",
          "horror",
          "sci-fi",
          "western",
          "musical",
        ];
        const data = await searchMoviesMultiTerms(randomTerms, 1);
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
