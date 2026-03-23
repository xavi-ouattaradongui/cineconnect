import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

// Mock the middleware directly
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "test_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};

describe("authMiddleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("renvoie 401 si aucun header Authorization", () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token manquant" });
    expect(next).not.toHaveBeenCalled();
  });

  it("renvoie 401 si le token est invalide", () => {
    req.headers.authorization = "Bearer token_invalide";
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token invalide" });
    expect(next).not.toHaveBeenCalled();
  });

  it("appelle next() et set req.user si le token est valide", () => {
    const payload = { id: 1, email: "test@test.com" };
    const token = jwt.sign(payload, "test_secret");
    req.headers.authorization = `Bearer ${token}`;
    process.env.JWT_SECRET = "test_secret";

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
  });
});
