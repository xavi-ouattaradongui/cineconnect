import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import { initSocket } from "./sockets/chat.socket.js";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initSocket(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🔥 Server + Socket running on http://localhost:${PORT}`);
});
