import express from "express";
import { getMessagesByFilm, createMessage, deleteMessage } from "../controllers/messages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/film/:imdbId", getMessagesByFilm);
router.post("/film/:imdbId", authMiddleware, createMessage);
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
