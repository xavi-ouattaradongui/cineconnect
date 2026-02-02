import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Serveur CineConnect démarré sur http://localhost:${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/docs`);
  console.log(`🔗 Routes disponibles:`);
  console.log(`   - POST   /auth/register`);
  console.log(`   - POST   /auth/login`);
  console.log(`   - GET    /films`);
  console.log(`   - POST   /reviews`);
  console.log(`   - GET    /reviews/film/:filmId`);
  console.log(`   - PUT    /reviews/:id`);
  console.log(`   - DELETE /reviews/:id`);
});
