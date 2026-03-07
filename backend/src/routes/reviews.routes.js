/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reviews and reactions on films
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a film
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [filmId, rating]
 *             properties:
 *               filmId:
 *                 type: string
 *                 description: IMDB id of the film
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *               comment:
 *                 type: string
 *               title:
 *                 type: string
 *               poster:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /reviews/film/{filmId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for one film
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: string
 *         description: IMDB id of the film
 *     responses:
 *       200:
 *         description: Reviews list
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update own review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete own review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Review deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /reviews/{id}/reaction:
 *   post:
 *     tags: [Reviews]
 *     summary: Toggle like or dislike on a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, dislike]
 *     responses:
 *       200:
 *         description: Reaction toggled
 *       400:
 *         description: Invalid reaction type
 *       404:
 *         description: Review not found
 */

import express from "express";
import {
  createReview,
  getReviewsByFilm,
  updateReview,
  deleteReview,
  toggleReaction,
} from "../controllers/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/film/:filmId", getReviewsByFilm);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
router.post("/:id/reaction", authMiddleware, toggleReaction);

export default router;
