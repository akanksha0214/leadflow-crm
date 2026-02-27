import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // 🔥 make io globally available (cron + utils)
  global.io = io;

  io.on("connection", (socket) => {
    console.log("🔌 Server connected:", socket.id);

    socket.on("join", (userId) => {
      if (!userId) return;

      socket.join(String(userId));
      console.log("👤 User joined room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });

  return io;
};
