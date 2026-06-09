
import asyncHandler from 'express-async-handler';
import Fooditem from '../models/fooditemModel.js';
import Chef from '../models/chefModel.js';
import mongoose from "mongoose";

// @desc    Fetch all food items with pagination and flexible search keyword including chef and kitchen names and user address filtering
// @route   GET /api/fooditems?keyword=&pageNumber=&pageSize=&userAddress=
// @access  Public
const getFooditems = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;
  const keywordRaw = req.query.keyword || "";
  const keyword = keywordRaw
    .toLowerCase()
    .split(' ')
    .map(word => word.trim())
    .filter(word => word.length > 0);

  const userAddress = req.query.userAddress ? req.query.userAddress.trim().toLowerCase() : null;

  let chefIds = [];
  if (keyword.length > 0) {
    // Find chefs matching any keyword word in name, kitchenName
    const chefMatchConditions = keyword.map(word => {
      const regex = new RegExp(`.*${word}.*`, 'i');
      return {
        $or: [
          { name: { $regex: regex } },
          { kitchenName: { $regex: regex } },
        ],
      };
    });
    const chefs = await Chef.find({ $or: chefMatchConditions }).select('_id');
    chefIds = chefs.map(chef => chef._id);
  }

  // Build fooditem match conditions for any keyword word in name, description, or user in chefIds
  const fooditemMatchConditions = keyword.map(word => {
    const regex = new RegExp(`.*${word}.*`, 'i');
    return {
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { user: { $in: chefIds } },
      ],
    };
  });

  const matchQuery = keyword.length > 0 ? { $or: fooditemMatchConditions } : {};

  if (userAddress) {
    // Use aggregation to join chefs and prioritize fooditems where chef.address matches userAddress
    const aggregatePipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: "chefs",
          localField: "user",
          foreignField: "_id",
          as: "chef",
        },
      },
      { $unwind: "$chef" },
      {
        $addFields: {
          addressMatch: {
            $cond: [
              { $eq: [{ $trim: { input: { $toLower: "$chef.address" } } }, userAddress] },
              1,
              0,
            ],
          },
        },
      },
      { $sort: { addressMatch: -1, createdAt: -1 } },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          image: 1,
          category: 1,
          countInStock: 1,
          calories: 1,
          user: 1,
          createdAt: 1,
          updatedAt: 1,
          addressMatch: 1,
        },
      },
    ];

    const fooditems = await Fooditem.aggregate(aggregatePipeline);

    // Populate user field manually since aggregate does not populate
    const userIds = fooditems.map(item => item.user);
    const users = await Chef.find({ _id: { $in: userIds } }).select('name kitchenName address');
    const usersMap = {};
    users.forEach(user => {
      usersMap[user._id.toString()] = user;
    });

    const fooditemsWithUser = fooditems.map(item => {
      return {
        ...item,
        user: usersMap[item.user.toString()] || null,
      };
    });

    const count = await Fooditem.countDocuments(matchQuery);

    res.json({ fooditems: fooditemsWithUser, page, pages: Math.ceil(count / pageSize) });
  } else {
    const count = await Fooditem.countDocuments(matchQuery);
    const fooditems = await Fooditem.find(matchQuery)
      .populate('user', 'name kitchenName')
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.json({ fooditems, page, pages: Math.ceil(count / pageSize) });
  }
});

// New controller function for recommended food items based on content filtering (category similarity)
const getRecommendedFooditems = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 4;
  const fooditemId = req.query.fooditemId;

  if (!fooditemId || !mongoose.Types.ObjectId.isValid(fooditemId)) {
    res.status(400);
    throw new Error("Invalid or missing fooditemId query parameter");
  }

  const baseFooditem = await Fooditem.findById(fooditemId);

  if (!baseFooditem) {
    res.status(404);
    throw new Error("Base food item not found");
  }

  // Find food items with the same category, excluding the base food item
  const recommendedFooditems = await Fooditem.find({
    category: baseFooditem.category,
    _id: { $ne: baseFooditem._id },
  })
    .limit(limit)
    .populate('user', 'name kitchenName');

  res.json(recommendedFooditems);
});


// @desc    Fetch food items for logged-in chef
// @route   GET /api/fooditems/chef
// @access  Private
const getChefFooditems = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.json([]);
  }
  const fooditems = await Fooditem.find({ user: req.user._id });
  res.json(fooditems);
});

// @desc    Fetch food items by chef ID
// @route   GET /api/fooditems/chef/:id
// @access  Public
const getFooditemsByChefId = asyncHandler(async (req, res) => {
  const chefId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(chefId)) {
    res.status(400);
    throw new Error("Invalid chef ID");
  }
  const fooditems = await Fooditem.find({ user: chefId }).populate("user", "name kitchenName _id");
  res.json(fooditems);
});

// @desc    Fetch single food item by ID
// @route   GET /api/fooditems/:id
// @access  Public
const getFooditemById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid food item ID");
  }
  const fooditem = await Fooditem.findById(id).populate("user", "name kitchenName");
  if (fooditem) {
    res.json(fooditem);
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
});

// @desc    Create a food item
// @route   POST /api/fooditems
// @access  Private (Chef or Admin)
const createFooditem = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized, no user found");
  }
  const { name, description, price, category, countInStock, calories } = req.body;
  let image = req.file ? req.file.path : req.body.image;
  if (image) {
    image = image.replace(/\\/g, "/");
    if (image.startsWith("backend/")) {
      image = image.replace("backend/", "");
    }
    if (!image.startsWith("/uploads/")) {
      if (image.startsWith("uploads/")) {
        image = "/" + image;
      } else {
        image = "/uploads/" + image;
      }
    }
  }

  const fooditem = new Fooditem({
    name,
    description,
    price,
    image,
    category,
    countInStock,
    calories,
    user: req.user._id,
  });

  const createdItem = await fooditem.save();
  res.status(201).json(createdItem);
});

// @desc    Update a food item
// @route   PUT /api/fooditems/:id
// @access  Private (Chef or Admin)
const updateFooditem = asyncHandler(async (req, res) => {
  const { name, description, price, category, countInStock, calories } = req.body;
  let image = req.file ? req.file.path : req.body.image;
  if (image) {
    image = image.replace(/\\/g, "/");
    if (image.startsWith("backend/")) {
      image = image.replace("backend/", "");
    }
    if (!image.startsWith("/uploads/")) {
      if (image.startsWith("uploads/")) {
        image = "/" + image;
      } else {
        image = "/uploads/" + image;
      }
    }
  }

  const fooditem = await Fooditem.findById(req.params.id);

  if (fooditem) {
    if (req.user.isAdmin || fooditem.user.toString() === req.user._id.toString()) {
      fooditem.name = name || fooditem.name;
      fooditem.description = description || fooditem.description;
      fooditem.price = price || fooditem.price;
      fooditem.image = image || fooditem.image;
      fooditem.category = category || fooditem.category;
      fooditem.countInStock = countInStock || fooditem.countInStock;
      fooditem.calories = calories || fooditem.calories;

      const updatedItem = await fooditem.save();
      res.json(updatedItem);
    } else {
      res.status(401);
      throw new Error('Not authorized to update this food item');
    }
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
});

// @desc    Delete a food item
// @route   DELETE /api/fooditems/:id
// @access  Private (Chef or Admin)
const deleteFooditem = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid food item ID");
    }

    const fooditem = await Fooditem.findById(req.params.id);

    if (fooditem) {
      if (req.user.isAdmin || fooditem.user.toString() === req.user._id.toString()) {
        await fooditem.deleteOne();
        res.json({ message: 'Food item removed' });
      } else {
        res.status(401);
        throw new Error('Not authorized to delete this food item');
      }
    } else {
      res.status(404);
      throw new Error('Food item not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// @desc    Create a new review
// @route   POST /api/fooditems/:id/reviews
// @access  Private
const createFooditemReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const fooditem = await Fooditem.findById(req.params.id);

  if (fooditem) {
    const alreadyReviewed = fooditem.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Food item already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    fooditem.reviews.push(review);

    fooditem.rating =
      fooditem.reviews.reduce((acc, item) => item.rating + acc, 0) /
      fooditem.reviews.length;

    await fooditem.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Food item not found');
  }
});

// @desc    Get top rated food items
// @route   GET /api/fooditems/top
// @access  Public
const getTopFooditems = asyncHandler(async (req, res) => {
  const fooditems = await Fooditem.find({}).sort({ rating: -1 }).limit(5);
  res.json(fooditems);
});

export {
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
};
