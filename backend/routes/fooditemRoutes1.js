import express from "express";
import asyncHandler from "express-async-handler";
import Fooditem from "../models/fooditemModel.js";
const router = express.Router();
import {
  getFooditems,
  getFooditemById,
  deleteFooditem,
  createFooditem,
  updateFooditem,
  createFooditemReview,
  getTopFooditems,
  getChefFooditems,
  getFooditemsByChefId,
  getRecommendedFooditems,
} from "../controllers/fooditemController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// Route to get all food items and create a new food item (admin only)
router.route("/").get(getFooditems).post(protect, admin, upload.single("image"), createFooditem);

// Route to get food items for logged-in chef
router.route("/chef").get(protect, getChefFooditems);

// Route to get top rated food items
router.get("/top", getTopFooditems);

// Route to get recommended food items based on a fooditemId query parameter
router.get("/recommended", getRecommendedFooditems);

// Route to get single food item by ID
router.route("/:id").get(getFooditemById);

// New route to get food items by chef ID (public)
router.route("/chef/:id").get(getFooditemsByChefId);

// New routes for chefs to create, update, and delete their own food items
router.route("/chef/create").post(protect, upload.single("image"), createFooditem);
router
  .route("/chef/:id")
  .put(protect, upload.single("image"), updateFooditem)
  .delete(protect, deleteFooditem);

export default router;
