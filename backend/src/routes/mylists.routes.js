/**
 * @swagger
 * tags:
 *   name: MyList
 *   description: Personal watchlist management
 */

/**
 * @swagger
 * /mylists:
 *   get:
 *     tags: [MyList]
 *     summary: Get current user watchlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watchlist retrieved
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [MyList]
 *     summary: Add a film to watchlist
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
 *         description: Film added to watchlist
 *       400:
 *         description: Missing data or duplicate
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /mylists/{imdbId}:
 *   delete:
 *     tags: [MyList]
 *     summary: Remove a film from watchlist
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
 *         description: Film removed from watchlist
 *       404:
 *         description: Film not found in watchlist
 */

import express from "express";
import {
  getMyList,
  addToMyList,
  removeFromMyList,
} from "../controllers/mylists.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getMyList);
router.post("/", authMiddleware, addToMyList);
router.delete("/:imdbId", authMiddleware, removeFromMyList);

export default router;
