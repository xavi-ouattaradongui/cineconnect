import express from "express";
import {
  createReview,
  getReviewsByFilm,
} from "../controllers/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/film/:filmId", getReviewsByFilm);

export default router;
