import express from "express";
import { createReview, getAllReviews, getReviewsByFooditem } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/", protect, getAllReviews);
router.get("/fooditem/:id", getReviewsByFooditem);

export default router;