import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const register = async (req, res) => {
  const { username, email, password, displayName } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [user] = await db
      .insert(users)
      .values({ 
        username, 
        email, 
        password: hashedPassword,
        displayName: displayName || username
      })
      .returning({ 
        id: users.id, 
        username: users.username, 
        email: users.email,
        displayName: users.displayName,
        avatar: users.avatar
      });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ 
      message: "Utilisateur créé", 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName || user.username,
        avatar: user.avatar || null
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: "Email ou username déjà utilisé" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({ 
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      avatar: user.avatar || null
    }
  });
};
