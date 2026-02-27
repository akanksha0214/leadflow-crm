import express from "express";
import {
getNotifications,   markNotificationRead
} from "../controller/notificationController.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";

const router = express.Router();

router.get("/", auth, getNotifications);
router.put("/read", auth, markNotificationRead);

export default router;
