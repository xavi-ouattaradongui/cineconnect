import express from "express";
import {
  createFilm,
  getFilmByImdbId,
} from "../controllers/films.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createFilm);
router.get("/:imdbId", getFilmByImdbId);

export default router;
