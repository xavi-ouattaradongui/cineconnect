/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Film categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: Categories list
 *       500:
 *         description: Server error
 *   post:
 *     tags: [Categories]
 *     summary: Create one category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Missing or duplicate category
 */

/**
 * @swagger
 * /categories/init:
 *   post:
 *     tags: [Categories]
 *     summary: Seed default categories
 *     responses:
 *       201:
 *         description: Seed completed
 *       500:
 *         description: Server error
 */

import express from "express";
import { getCategories, createCategory, initializeCategories } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.post("/init", initializeCategories);

export default router;
