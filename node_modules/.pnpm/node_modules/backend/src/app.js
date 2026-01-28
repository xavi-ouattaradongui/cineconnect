import express from "express";
import cors from "cors";
import { db } from "./db/index.js";
import authRoutes from "./routes/auth.routes.js";

const app = express(); 

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CineConnect API running 🎬");
});

app.get("/db-test", async (req, res) => {
  try {
    await db.execute("SELECT 1");
    res.json({ status: "PostgreSQL connected ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PostgreSQL error ❌" });
  }
});

export default app;
