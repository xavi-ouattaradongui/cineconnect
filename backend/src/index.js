import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets/chat.socket.js";


dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);

server.listen(PORT, () => {
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
  console.log(`   - GET    /favorites`);
  console.log(`   - POST   /favorites`);
  console.log(`   - DELETE /favorites/:imdbId`);
  console.log(`   - GET    /mylists`);
  console.log(`   - POST   /mylists`);
  console.log(`   - DELETE /mylists/:imdbId`);
  console.log(`   - GET    /messages/film/:imdbId`);
  console.log(`   - POST   /messages/film/:imdbId`);
});
