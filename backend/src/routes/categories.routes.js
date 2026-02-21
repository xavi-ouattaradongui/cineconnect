import express from "express";
import { getCategories, createCategory, initializeCategories } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.post("/init", initializeCategories);

export default router;
