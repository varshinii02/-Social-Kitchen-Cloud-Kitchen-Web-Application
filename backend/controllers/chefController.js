import asyncHandler from "express-async-handler";
import ChefApplication from "../models/chefApplicationModel.js";
import Chef from "../models/chefModel.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

/**
 * @desc    Auth chef & get token
 * @route   POST /api/chefs/login
 * @access  Public
 */
const loginChef = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  console.log("loginChef called with email:", email, "phone:", phone);

  const chef = await Chef.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
  console.log("Chef found:", chef);

  if (chef) {
    const isMatch = await chef.matchPassword(password);
    console.log("Password match:", isMatch);
    if (isMatch) {
      let profilePicPath = chef.profilePic;
  // Remove any leading "uploads/" and replace backslashes with forward slashes before sending
  if (profilePicPath) {
    profilePicPath = profilePicPath.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
  }
      res.json({
        _id: chef._id,
        name: chef.name,
        email: chef.email,
        phone: chef.phone,
        profilePic: profilePicPath, // Include normalized profilePic in response
        token: generateToken(chef._id),
      });
      return;
    }
  }
  res.status(401);
  throw new Error("Invalid email, phone, or password");
});

/**
 * @desc    Register a new chef
 * @route   POST /api/chefs/signup
 * @access  Public
 */
const registerChef = asyncHandler(async (req, res) => {
  console.log("registerChef called with body:", req.body);
  console.log("registerChef file:", req.file);

  const { name, kitchenName, email, password, phone, address, about } = req.body;

  const chefExists = await Chef.findOne({ email });

  if (chefExists) {
    res.status(400);
    throw new Error("Chef already exists with this email");
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
  }

  // Handle profilePic upload
  let profilePicPath = null;
  if (req.file) {
    // Remove leading "uploads/" or any directory path, keep only filename
    profilePicPath = req.file.filename || req.file.path.split(/[\\/]/).pop();
  }
  
  try {
    const chef = new Chef({
      name,
      kitchenName,
      email,
      password,
      phone,
      address,
      about,
      profilePic: profilePicPath,
    });

    const createdChef = await chef.save();

    if (createdChef) {
      res.status(201).json({
        _id: createdChef._id,
        name: createdChef.name,
        kitchenName: createdChef.kitchenName,
        email: createdChef.email,
        phone: createdChef.phone,
        address: createdChef.address,
        about: createdChef.about,
        profilePic: createdChef.profilePic,
        token: generateToken(createdChef._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid chef data");
    }
  } catch (error) {
    console.error("Error saving chef:", error);
    res.status(500);
    throw new Error("Server error while saving chef");
  }
});

/**
 * @desc    Delete a chef
 * @route   DELETE /api/chefs/:id
 * @access  Private/Admin
 */
const deleteChef = asyncHandler(async (req, res) => {
  const chef = await Chef.findById(req.params.id);

  if (!chef) {
    res.status(404);
    throw new Error("Chef not found");
  }

  await chef.remove();

  res.json({ message: "Chef removed" });
});

/**
 * @desc    Get all chefs
 * @route   GET /api/chefs
 * @access  Public
 */
const getChefs = asyncHandler(async (req, res) => {
  const userAddress = req.query.address ? req.query.address.toLowerCase() : null;

  let chefs = await Chef.find({}, 'name kitchenName email phone about address profilePic');

  if (userAddress) {
    // Prioritize chefs whose address includes the userAddress string
    chefs = chefs.sort((a, b) => {
      const aMatch = a.address ? a.address.toLowerCase().includes(userAddress) : false;
      const bMatch = b.address ? b.address.toLowerCase().includes(userAddress) : false;
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  chefs = chefs.map(chef => {
    // Log profilePic before normalization
    console.log(`Before normalization profilePic for chef ${chef.name}: ${chef.profilePic}`);
    // Normalize profilePic path to remove duplicated /uploads/ prefixes and keep only filename
    if (chef.profilePic && !chef.profilePic.startsWith('http')) {
      chef.profilePic = chef.profilePic.replace(/\\/g, '/');
      while (chef.profilePic.startsWith('uploads/')) {
        chef.profilePic = chef.profilePic.replace(/^uploads\//, '');
      }
      while (chef.profilePic.startsWith('/uploads/')) {
        chef.profilePic = chef.profilePic.replace(/^\/uploads\//, '');
      }
      chef.profilePic = chef.profilePic.split('/').pop();
    }
    // Log profilePic after normalization
    console.log(`After normalization profilePic for chef ${chef.name}: ${chef.profilePic}`);
    return chef;
  });

  chefs.forEach(chef => {
    console.log(`Chef: ${chef.name}, kitchenName: ${chef.kitchenName}, profilePic: ${chef.profilePic}`);
  });

  res.json(chefs);
});

/**
 * @desc    Get chef application by email (query param)
 * @route   GET /api/chefs/application?email=
 * @access  Private
 */
const getChefApplicationByEmailQuery = asyncHandler(async (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.status(400);
    throw new Error("Email query parameter is required");
  }

  const application = await ChefApplication.findOne({ email });

  if (!application) {
    res.status(404);
    throw new Error("Chef application not found");
  }

  res.json(application);
});

/**
 * @desc    Get chef application by email
 * @route   GET /api/chefs/application/:email
 * @access  Private
 */
const getChefApplicationByEmail = asyncHandler(async (req, res) => {
  const email = req.params.email;

  const application = await ChefApplication.findOne({ email });

  if (!application) {
    res.status(404);
    throw new Error("Chef application not found");
  }

  res.json(application);
});

/**
 * @desc    Approve a chef application
 * @route   PUT /api/admin/chef-applications/:id/approve
 * @access  Private/Admin
 */
const approveChefApplication = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;

  const application = await ChefApplication.findById(applicationId);

  if (!application) {
    res.status(404);
    throw new Error("Chef application not found");
  }

  application.status = "approved";
  await application.save();

  console.log("Approving chef application with address:", application.address);

  // Create a new Chef from the approved application
  const chefExists = await Chef.findOne({ email: application.email });
  if (chefExists) {
    res.status(400);
    throw new Error("Chef with this email already exists");
  }

  const chef = new Chef({
    name: application.name,
    email: application.email,
    phone: application.phone,
    about: application.message,
    address: application.address,
    kitchenName: application.kitchenName ? application.kitchenName : "N/A", // Ensure kitchenName is set properly
    // Add other fields as necessary
  });

  console.log("New chef data:", chef);

  await chef.save();

  res.json({ message: "Chef application approved and chef created" });
});

/**
 * @desc    Reject a chef application
 * @route   PUT /api/admin/chef-applications/:id/reject
 * @access  Private/Admin
 */
const rejectChefApplication = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;

  const application = await ChefApplication.findById(applicationId);

  if (!application) {
    res.status(404);
    throw new Error("Chef application not found");
  }

  application.status = "rejected";
  await application.save();

  res.json({ message: "Chef application rejected" });
});

/**
 * @desc    Submit a chef application
 * @route   POST /api/chefs/application
 * @access  Public
 */
const submitChefApplication = asyncHandler(async (req, res) => {
  let {
    name,
    email,
    phone,
    message,
    address,
    portfolioLink,
    availabilityDays,
    availabilityStartTime,
    availabilityEndTime,
    city,
    postalCode,
    state,
  } = req.body;

  // Parse availabilityDays if it is a string
  if (typeof availabilityDays === "string") {
    try {
      availabilityDays = JSON.parse(availabilityDays);
    } catch (error) {
      availabilityDays = [];
    }
  }

  const availabilityDaysCount = Array.isArray(availabilityDays) ? availabilityDays.length : 0;

  let sampleMenuFile = req.files?.sampleMenuFile ? req.files.sampleMenuFile[0].path : null;
  let governmentIdFile = req.files?.governmentIdFile ? req.files.governmentIdFile[0].path : null;
  const profilePic = req.file ? req.file.path : null;

  // Normalize file paths by removing leading "uploads/" if present
  if (sampleMenuFile && sampleMenuFile.startsWith("uploads/")) {
    sampleMenuFile = sampleMenuFile.slice(8);
  }
  if (governmentIdFile && governmentIdFile.startsWith("uploads/")) {
    governmentIdFile = governmentIdFile.slice(8);
  }

  const existingApplication = await ChefApplication.findOne({ email });

  if (existingApplication) {
    res.status(400);
    throw new Error("Chef application with this email already exists");
  }

  const application = new ChefApplication({
    name,
    email,
    phone,
    message,
    address,
    portfolioLink,
    availabilityDays,
    availabilityDaysCount,
    availabilityStartTime,
    availabilityEndTime,
    city,
    postalCode,
    state,
    sampleMenuFile,
    governmentIdFile,
    profilePic,
    status: "pending",
  });

  const createdApplication = await application.save();

  res.status(201).json(createdApplication);
});

/**
 * @desc    Get all chef applications
 * @route   GET /api/admin/chef-applications
 * @access  Private/Admin
 */
const getChefApplications = asyncHandler(async (req, res) => {
  const applications = await ChefApplication.find({});

  // Fetch kitchenName from Chef collection for each application by matching email
  const applicationsWithKitchenName = await Promise.all(
    applications.map(async (application) => {
      const chef = await Chef.findOne({ email: application.email });
      // Fallback to application.kitchenName if chef.kitchenName is missing
      const kitchenName = chef && chef.kitchenName ? chef.kitchenName : (application.kitchenName || "N/A");
      console.log(`Email: ${application.email}, KitchenName found: ${kitchenName}`);
      return {
        ...application._doc,
        kitchenName,
      };
    })
  );

  res.json(applicationsWithKitchenName);
});

import Fooditem from "../models/fooditemModel.js";
import Order from "../models/orderModel.js";
import Review from "../models/reviewModel.js";

const getChefOverview = asyncHandler(async (req, res) => {
  const chefId = req.user._id;

  // Count available food items
  const totalAvailableItems = await Fooditem.countDocuments({ user: chefId, countInStock: { $gt: 0 } });

  // Find all orders that contain orderItems for this chef
  const orders = await Order.find({ "orderItems.chef": chefId });

  // Count total orders (distinct orders)
  const totalOrders = orders.length;

  // Calculate total earnings by summing price * qty of orderItems for this chef
  let totalEarnings = 0;
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      if (item.chef.toString() === chefId.toString()) {
        totalEarnings += item.price * item.qty;
      }
    });
  });

  // Find all reviews for this chef's food items
  // First, get all food item IDs for this chef
  const foodItems = await Fooditem.find({ user: chefId }, "_id");
  const foodItemIds = foodItems.map(item => item._id);

  // Find reviews where orderItem is in orders with chefId and linked to these food items
  // Since Review references orderItem (subdocument), we filter by orderItems in orders
  // To simplify, find all reviews for orders that contain chef's items
  const reviews = await Review.find({ order: { $in: orders.map(o => o._id) } });

  // Calculate average rating
  let totalRating = 0;
  reviews.forEach(review => {
    totalRating += review.rating;
  });
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  res.json({
    totalAvailableItems,
    totalOrders,
    totalEarnings,
    averageRating: averageRating.toFixed(2),
  });
});

export { loginChef, deleteChef, getChefs, getChefApplicationByEmail, getChefApplicationByEmailQuery, approveChefApplication, rejectChefApplication, submitChefApplication, getChefApplications, registerChef, getChefOverview };
