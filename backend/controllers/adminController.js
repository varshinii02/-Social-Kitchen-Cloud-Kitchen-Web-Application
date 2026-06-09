import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Chef from "../models/chefModel.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  // Count chefs from Chef collection
  const chefsCount = await Chef.countDocuments();

  // Count delivery partners
  const deliveryPartnersCount = await User.countDocuments({ role: "delivery" });

  // Count customers
  const customersCount = await User.countDocuments({ role: "user" });

  // Calculate total revenue from order items
  const orders = await Order.find({});
  let totalRevenue = 0;
  orders.forEach(order => {
    order.orderItems.forEach(item => {
      totalRevenue += item.price * item.qty;
    });
  });

  res.json({
    chefsCount,
    deliveryPartnersCount,
    customersCount,
    totalRevenue,
  });
});

export { getAdminStats };
