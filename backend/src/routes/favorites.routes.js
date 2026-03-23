/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: User favorites management
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Get current user favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites list
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Favorites]
 *     summary: Add a film to favorites
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
 *         description: Favorite created
 *       400:
 *         description: Missing data or already favorite
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /favorites/{imdbId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Remove a film from favorites
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favorite removed
 *       404:
 *         description: Film or favorite not found
 */

import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getFavorites);
router.post("/", authMiddleware, addFavorite);
router.delete("/:imdbId", authMiddleware, removeFavorite);

export default router;
