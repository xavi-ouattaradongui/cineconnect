/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Film chat messages
 */

/**
 * @swagger
 * /messages/film/{imdbId}:
 *   get:
 *     tags: [Messages]
 *     summary: Get chat messages for a film
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
 *         description: Messages fetched
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags: [Messages]
 *     summary: Create a chat message for a film
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *               title:
 *                 type: string
 *               poster:
 *                 type: string
 *               year:
 *                 type: integer
 *               replyToId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Message created
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Soft delete then hard delete own message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Message not found
 */

/**
 * @swagger
 * /messages/film/{imdbId}/seen:
 *   post:
 *     tags: [Messages]
 *     summary: Update last chat seen timestamp
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
 *         description: Last seen updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Film not found
 */

import express from "express";
import { getMessagesByFilm, createMessage, deleteMessage, updateChatSeen } from "../controllers/messages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/film/:imdbId", authMiddleware, getMessagesByFilm);
router.post("/film/:imdbId", authMiddleware, createMessage);
router.delete("/:id", authMiddleware, deleteMessage);
router.post("/film/:imdbId/seen", authMiddleware, updateChatSeen);

export default router;
