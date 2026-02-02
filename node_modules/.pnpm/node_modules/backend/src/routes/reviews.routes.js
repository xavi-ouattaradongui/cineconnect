import express from "express";
import {
  createReview,
  getReviewsByFilm,
  updateReview,
  deleteReview,
} from "../controllers/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createReview);
router.get("/film/:filmId", getReviewsByFilm);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
