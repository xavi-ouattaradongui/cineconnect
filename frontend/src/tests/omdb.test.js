import { describe, expect, it } from "vitest";
import {
  filterUsableMovies,
  hasUsableMovieDetails,
  hasUsableMovieSummary,
  normalizeMovieData,
} from "../api/omdb";

describe("OMDb filtering", () => {
  it("garde uniquement les films avec un titre, une annee et un poster exploitables", () => {
    const movies = [
      {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster:
          "https://m.media-amazon.com/images/M/MV5BM.jpg",
      },
      {
        imdbID: "tt0000001",
        Title: "Film sans poster",
        Year: "2001",
        Poster: "N/A",
      },
      {
        imdbID: "tt0000002",
        Title: "",
        Year: "2002",
        Poster: "https://example.com/poster.jpg",
      },
    ];

    expect(filterUsableMovies(movies)).toEqual([movies[0]]);
  });

  it("normalise les valeurs N/A de OMDb en null", () => {
    expect(
      normalizeMovieData({
        imdbID: "tt0133093",
        Title: "The Matrix",
        Plot: "N/A",
        Genre: "",
      })
    ).toEqual({
      imdbID: "tt0133093",
      Title: "The Matrix",
      Plot: null,
      Genre: null,
    });
  });

  it("accepte un detail film partiel tant que le resume est exploitable", () => {
    expect(
      hasUsableMovieDetails({
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster: "https://example.com/poster.jpg",
        Plot: null,
      })
    ).toBe(true);
  });

  it("valide un film complet", () => {
    expect(
      hasUsableMovieSummary({
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster: "https://example.com/poster.jpg",
      })
    ).toBe(true);

    expect(
      hasUsableMovieDetails({
        imdbID: "tt0133093",
        Title: "The Matrix",
        Year: "1999",
        Poster: "https://example.com/poster.jpg",
        Plot: "A hacker discovers reality is a simulation.",
        Genre: "Action, Sci-Fi",
        Runtime: "136 min",
        imdbRating: "8.7",
      })
    ).toBe(true);
  });
});