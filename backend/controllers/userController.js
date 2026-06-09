import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;
  console.log("authUser called with email:", email, "phone:", phone);

  if (!email && !phone) {
    res.status(400);
    throw new Error("Email or phone number is required");
  }

  let user = null;
  if (phone && email) {
    // Find user with role NOT 'chef' by phone or email
    const userByPhone = await User.findOne({ phone: phone.trim(), role: { $ne: "chef" } });
    const userByEmail = await User.findOne({ email: email.trim().toLowerCase(), role: { $ne: "chef" } });
    console.log("User by phone:", userByPhone ? { _id: userByPhone._id, email: userByPhone.email, phone: userByPhone.phone } : null);
    console.log("User by email:", userByEmail ? { _id: userByEmail._id, email: userByEmail.email, phone: userByEmail.phone } : null);
    user = userByPhone || userByEmail;
  } else if (phone) {
    user = await User.findOne({ phone: phone.trim(), role: { $ne: "chef" } });
  } else if (email) {
    user = await User.findOne({ email: email.trim().toLowerCase(), role: { $ne: "chef" } });
  }
  console.log("User found:", user ? { _id: user._id, email: user.email, phone: user.phone } : null);
  if (!user) {
    res.status(401);
    console.log("User not found");
    throw new Error("Invalid phone/email or password");
  }
  console.log("Received password:", password);
  console.log("Stored hashed password:", user.password ? user.password.substring(0, 10) + "..." : "No password");
  const isMatch = await user.matchPassword(password);
  console.log("Password match:", isMatch);
  if (user && isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    console.log("Invalid password");
    throw new Error("Invalid phone/email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  let { name, kitchensName, email, password, phone, role, address } = req.body;

  console.log("RegisterUser password received:", password);
  password = password.trim();

  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    if (userExists.role === "chef") {
      throw new Error("Chef already exists with this mobile number");
    } else {
      throw new Error("User already exists with this mobile number");
    }
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
  }

  const user = await User.create({
    name,
    kitchensName,
    email,
    password,
    phone,
    role: role || "user",
    address,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      kitchensName: user.kitchensName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Register a new chef user
// @route   POST /api/users/signup-chef
// @access  Public
const registerChef = asyncHandler(async (req, res) => {
  const { name, kitchensName, email, password, phone, address } = req.body;

  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    if (userExists.role === "chef") {
      throw new Error("Chef already exists with this mobile number");
    } else {
      throw new Error("User already exists with this mobile number");
    }
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
    profilePicPath = req.file.path;
  }

  const user = await User.create({
    name,
    kitchensName,
    email,
    password,
    phone,
    address,
    role: "chef",
    profilePic: profilePicPath,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      kitchensName: user.kitchensName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const roleFilter = req.query.role ? { role: req.query.role } : {};
  const users = await User.find(roleFilter);
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get cart items for logged in user
// @route   GET /api/users/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user.cartItems || []);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update cart items for logged in user
// @route   PUT /api/users/cart
// @access  Private
const updateUserCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.cartItems = req.body.cartItems || [];
    const updatedUser = await user.save();
    res.json(updatedUser.cartItems);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  registerUser,
  registerChef,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getUserCart,
  updateUserCart,
};
