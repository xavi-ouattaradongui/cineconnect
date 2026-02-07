import express from "express";
import cors from "cors";
import { db } from "./db/index.js";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import filmRoutes from "./routes/films.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import mylistsRoutes from "./routes/mylists.routes.js";
import { swaggerSpec } from "./docs/swagger.js";

const app = express(); 

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/films", filmRoutes);
app.use("/reviews", reviewRoutes);
app.use("/messages", messageRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/mylists", mylistsRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



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
