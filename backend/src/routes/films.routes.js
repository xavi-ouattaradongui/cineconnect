/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Film creation and lookup
 */

/**
 * @swagger
 * /films:
 *   post:
 *     tags: [Films]
 *     summary: Create a film if not existing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [imdbId, title]
 *             properties:
 *               imdbId:
 *                 type: string
 *               title:
 *                 type: string
 *               poster:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Film created
 *       400:
 *         description: Missing data or duplicate film
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /films/{imdbId}:
 *   get:
 *     tags: [Films]
 *     summary: Get film by IMDB id
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film found
 *       404:
 *         description: Film not found
 */

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
