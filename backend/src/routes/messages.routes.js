import express from "express";
import { getMessagesByFilm, createMessage } from "../controllers/messages.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/film/:imdbId", getMessagesByFilm);
router.post("/film/:imdbId", authMiddleware, createMessage);

export default router;
