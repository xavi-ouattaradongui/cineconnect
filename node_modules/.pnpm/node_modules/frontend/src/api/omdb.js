const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = "https://www.omdbapi.com/"

export async function searchMovies(query) {
  const res = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${query}`
  )
  return res.json()
}

export async function getMovieById(id) {
  const res = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${id}`
  )
  return res.json()
}
