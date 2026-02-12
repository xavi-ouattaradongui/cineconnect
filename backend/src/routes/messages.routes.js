import express from "express";
import { getMessagesByFilm, createMessage, deleteMessage, updateChatSeen } from "../controllers/messages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/film/:imdbId", authMiddleware, getMessagesByFilm);
router.post("/film/:imdbId", authMiddleware, createMessage);
router.delete("/:id", authMiddleware, deleteMessage);
router.post("/film/:imdbId/seen", authMiddleware, updateChatSeen);

export default router;
