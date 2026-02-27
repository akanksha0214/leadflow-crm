import express from "express";
import {
  createLead,
  getAllLeads,
  editLead,
  deleteLead,
  markFollowUpDone, setNextFollowUp, getLeadActivities,getDashboardStats
} from "../controller/leadController.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";

const router = express.Router();

router.post("/create-lead", auth, createLead);
router.get("/leads", auth, getAllLeads);
router.put("/:id", auth, editLead);
router.put("/followup/:id", auth, markFollowUpDone);
router.put("/next-followup/:id", auth, setNextFollowUp)
router.get("/activities/:id", auth, getLeadActivities);
router.get("/dashboard", auth, getDashboardStats);



// admin-only delete
router.delete("/:id", auth, role(["admin"]), deleteLead);

export default router;
