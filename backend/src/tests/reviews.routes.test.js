import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";

vi.mock("../db/index.js", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}));

import { createReview, getReviewsByFilm, deleteReview } from "../controllers/reviews.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { db } from "../db/index.js";

process.env.JWT_SECRET = "test_secret";

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.post("/reviews", authMiddleware, createReview);
  app.get("/reviews/film/:filmId", getReviewsByFilm);
  app.delete("/reviews/:id", authMiddleware, deleteReview);
  return app;
};

const validToken = () =>
  `Bearer ${jwt.sign({ id: 1, email: "test@test.com" }, "test_secret")}`;

describe("POST /reviews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renvoie 401 sans token", async () => {
    const res = await request(makeApp()).post("/reviews").send({ filmId: "tt123", rating: 8 });
    expect(res.status).toBe(401);
  });

  it("renvoie 400 si rating manquant", async () => {
    const res = await request(makeApp())
      .post("/reviews")
      .set("Authorization", validToken())
      .send({ filmId: "tt123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Champs manquants");
  });
});

describe("GET /reviews/film/:filmId", () => {
  it("renvoie un tableau vide si le film n'existe pas en base", async () => {
    db.where.mockResolvedValueOnce([]);
    const res = await request(makeApp()).get("/reviews/film/tt_inconnu");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("DELETE /reviews/:id", () => {
  it("renvoie 401 sans token", async () => {
    const res = await request(makeApp()).delete("/reviews/1");
    expect(res.status).toBe(401);
  });

  it("renvoie 404 si la review n'existe pas", async () => {
    db.where.mockResolvedValueOnce([]);
    const res = await request(makeApp())
      .delete("/reviews/999")
      .set("Authorization", validToken());
    expect(res.status).toBe(404);
  });
});
