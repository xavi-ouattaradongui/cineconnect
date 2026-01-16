import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const omdb = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: { apikey: API_KEY },
});

export const searchMovies = async (title) => {
  const { data } = await omdb.get("/", { params: { s: title } });
  return data;
};

export const getMovieDetails = async (id) => {
  const { data } = await omdb.get("/", { params: { i: id, plot: "full" } });
  return data;
};

