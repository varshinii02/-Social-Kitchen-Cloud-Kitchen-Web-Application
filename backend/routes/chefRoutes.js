import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

import { 
  submitChefApplication, 
  loginChef, 
  getChefs, 
  deleteChef,
  getChefApplicationByEmail,
  registerChef
} from "../controllers/chefController.js";

import { getReviewsByChef } from "../controllers/reviewController.js";
import { getChefOverview } from "../controllers/chefController.js";


import upload from "../middleware/uploadMiddleware.js";

router.post("/signup", upload.single('profilePic'), registerChef);
router.post("/login", loginChef);
router.get("/", getChefs);

// Setup upload.fields for application form (2 files)
const uploadFields = upload.fields([
  { name: "sampleMenuFile", maxCount: 1 },
  { name: "governmentIdFile", maxCount: 1 },
]);

// Middleware to handle multer errors
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};

import { getChefApplicationByEmailQuery } from "../controllers/chefController.js";

// Route to get chef application by email (query param)
router.get("/application", getChefApplicationByEmailQuery);

// Route to submit chef application (with upload error handling)
router.post(
  "/application",
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        return uploadErrorHandler(err, req, res, next);
      }
      next();
    });
  },
  submitChefApplication
);

router.delete("/:id", protect, admin, deleteChef);

router.get("/:id/reviews", getReviewsByChef);

router.get("/overview", protect, getChefOverview);

export default router;
