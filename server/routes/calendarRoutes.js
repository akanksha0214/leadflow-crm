import express from "express";
import { downloadFollowupInvite } from "../controller/calendarController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/followup", auth, downloadFollowupInvite);

export default router;
