import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import Fooditem from "../models/fooditemModel.js";
import User from "../models/userModel.js";
import Chef from "../models/chefModel.js";
import mongoose from "mongoose";

// @desc    Create a new review for an order item
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { orderId, orderItemId, rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error("Please provide rating and comment");
  }

  // Check if review already exists for this user, order, and order item
  const existingReview = await Review.findOne({
    user: req.user._id,
    order: orderId,
    orderItem: orderItemId,
  });

  if (existingReview) {
    res.status(400);
    throw new Error("Review already submitted for this order item");
  }

  const review = new Review({
    user: req.user._id,
    order: orderId,
    orderItem: orderItemId,
    rating,
    comment,
  });

  const createdReview = await review.save();

  // Update fooditem rating and numReviews
  const order = await Order.findById(orderId);
  const orderItem = order.orderItems.id(orderItemId);
  const fooditemId = orderItem.fooditem;

  const orderItemsIds = await Order.find({ "orderItems.fooditem": fooditemId }).distinct("orderItems._id");

  const reviews = await Review.find({ orderItem: { $in: orderItemsIds } });

  const numReviews = reviews.length;
  const avgRating = numReviews > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews : 0;

  await Fooditem.findByIdAndUpdate(fooditemId, {
    numReviews,
    rating: avgRating,
  });

  res.status(201).json(createdReview);
});

// @desc    Get reviews for a food item
// @route   GET /api/reviews/fooditem/:id
// @access  Public
const getReviewsByFooditem = asyncHandler(async (req, res) => {
  const fooditemId = new mongoose.Types.ObjectId(req.params.id);

  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $addFields: {
        orderItem: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$order.orderItems",
                as: "item",
                cond: { $eq: ["$$item._id", "$orderItem"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "fooditems",
        localField: "orderItem.fooditem",
        foreignField: "_id",
        as: "fooditem",
      },
    },
    { $unwind: "$fooditem" },
    {
      $lookup: {
        from: "chefs",
        localField: "orderItem.chef",
        foreignField: "_id",
        as: "chef",
      },
    },
    { $unwind: "$chef" },
    {
      $match: {
        "fooditem._id": fooditemId,
      },
    },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        user: { name: "$user.name" },
        foodItem: "$fooditem.name",
        chef: "$chef.name",
        kitchenName: "$chef.kitchenName",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.json(reviews);
});

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $addFields: {
        orderItem: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$order.orderItems",
                as: "item",
                cond: { $eq: ["$$item._id", "$orderItem"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "fooditems",
        localField: "orderItem.fooditem",
        foreignField: "_id",
        as: "fooditem",
      },
    },
    { $unwind: "$fooditem" },
    {
      $lookup: {
        from: "chefs",
        localField: "orderItem.chef",
        foreignField: "_id",
        as: "chef",
      },
    },
    { $unwind: "$chef" },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        customer: "$user.name",
        foodItem: "$fooditem.name",
        chef: "$chef.name",
        kitchenName: "$chef.kitchenName",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  res.json(reviews);
});

// @desc    Get reviews for a chef
// @route   GET /api/chefs/:id/reviews
// @access  Public
const getReviewsByChef = asyncHandler(async (req, res) => {
  const chefId = new mongoose.Types.ObjectId(req.params.id);

  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "order",
      },
    },
    { $unwind: "$order" },
    {
      $addFields: {
        orderItem: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$order.orderItems",
                as: "item",
                cond: { $eq: ["$$item._id", "$orderItem"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "fooditems",
        localField: "orderItem.fooditem",
        foreignField: "_id",
        as: "fooditem",
      },
    },
    { $unwind: "$fooditem" },
    {
      $lookup: {
        from: "chefs",
        localField: "orderItem.chef",
        foreignField: "_id",
        as: "chef",
      },
    },
    { $unwind: "$chef" },
    {
      $match: {
        "chef._id": chefId,
      },
    },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        user: { name: "$user.name" },
        foodItem: "$fooditem.name",
        foodItemImage: "$fooditem.image",
        chef: "$chef.name",
        kitchenName: "$chef.kitchenName",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.json(reviews);
});

export { createReview, getReviewsByFooditem, getAllReviews, getReviewsByChef };
