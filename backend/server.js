import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

// Import Routes
import fooditemRoutes from "./routes/fooditemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Load environment variables
dotenv.config();
// Connect to MongoDB
connectDB();
// Create an Express app
const app = express();

// Morgan middleware for logging HTTP requests (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Middleware to parse incoming JSON requests
app.use(express.json());

// API routes
app.use("/api/fooditems", fooditemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/reviews", reviewRoutes);

// PayPal config route
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Static folder setup for uploaded images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  // Development root route
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5001;

// Start server
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
