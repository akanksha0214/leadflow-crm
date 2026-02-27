import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import leadsRoute from "./routes/leadsRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { startFollowupReminderCron } from "./cron/followupReminder.js";
import { initSocket } from "./socket.js";

const app = express();
const PORT = 5000;

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/lead", leadsRoute);
app.use("/notifications", notificationRoutes);
app.use("/ai", aiRoutes);

/* ================= SERVER + SOCKET ================= */
const server = http.createServer(app);
initSocket(server);

/* ================= DB + START ================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
    // start cron AFTER db is ready
    startFollowupReminderCron();
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
