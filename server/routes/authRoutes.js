import express from "express";
import { auth } from "../middleware/auth.js";
import { login, me, register, getAllUsers } from "../controller/authController.js";
import { role } from "../middleware/role.js"

const router = express.Router();

router.get("/me", auth, me);
router.post("/login", login);
router.post("/create-user", auth, role(["admin"]), register);
router.get("/users", auth, role(["admin"]), getAllUsers);

export default router;