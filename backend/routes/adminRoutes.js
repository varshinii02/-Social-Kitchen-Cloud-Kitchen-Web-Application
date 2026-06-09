import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getChefApplications,
  approveChefApplication,
  rejectChefApplication,
} from "../controllers/chefController.js";

const router = express.Router();

router.route("/stats").get(protect, admin, getAdminStats);

router.route("/chef-applications").get(protect, admin, getChefApplications);

router.route("/chef-applications/:id/approve").put(protect, admin, approveChefApplication);

router.route("/chef-applications/:id/reject").put(protect, admin, rejectChefApplication);

export default router;
