import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Chef from '../models/chefModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received in protect middleware:", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token payload:", decoded);
      // Try to find user first
      let user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        // If no user found, try to find chef
        const chef = await Chef.findById(decoded.id).select('-password');
        if (chef) {
          req.user = chef;
        } else {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }
      }
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    console.log("No token found in request headers");
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
