import express from "express";
import { rewriteNote } from "../controller/aiController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/format-notes", auth, rewriteNote);

export default router;
