import express from "express";
import { getMessagesByFilm } from "../controllers/messages.controller.js";

const router = express.Router();

router.get("/film/:filmId", getMessagesByFilm);

export default router;
