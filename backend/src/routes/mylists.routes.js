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
