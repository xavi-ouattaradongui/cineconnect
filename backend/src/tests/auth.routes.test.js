import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

// ── Mock db avant tout import qui l'utilise ──────────────────────────────────
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
  },
}));

vi.mock("../services/email.service.js", () => ({
  sendResetPasswordEmail: vi.fn().mockResolvedValue(true),
  sendWelcomeEmail: vi.fn().mockResolvedValue(true),
}));

import { register, login } from "../controllers/auth.controller.js";
import { db } from "../db/index.js";

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.post("/auth/register", register);
  app.post("/auth/login", login);
  return app;
};

describe("POST /auth/register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renvoie 400 si des champs sont manquants", async () => {
    const app = makeApp();
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Champs manquants");
  });

  it("renvoie 400 si le mot de passe est trop faible", async () => {
    const app = makeApp();
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "user", email: "test@test.com", password: "weak" });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("mot de passe");
  });

  it("renvoie 201 si les données sont valides", async () => {
    db.returning.mockResolvedValue([
      { id: 1, username: "user", email: "test@test.com", displayName: "user", avatar: null },
    ]);

    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "7d";

    const app = makeApp();
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "user", email: "test@test.com", password: "StrongPwd1!" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("test@test.com");
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renvoie 401 si l'utilisateur n'existe pas", async () => {
    db.where.mockResolvedValueOnce([]);
    const app = makeApp();
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "noone@test.com", password: "whatever" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Identifiants invalides");
  });
});
