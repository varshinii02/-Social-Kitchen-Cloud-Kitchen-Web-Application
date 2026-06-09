import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";  // Added import for User model
import Fooditem from "../models/fooditemModel.js";
import Chef from "../models/chefModel.js";

// @desc    Add new order items
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Clear user's cart after order creation
    const user = await User.findById(req.user._id);
    if (user) {
      user.cartItems = [];
      await user.save();
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({ user: req.user._id });

  // Enrich orderItems with fooditem image and chef kitchenName
  orders = await Promise.all(
    orders.map(async (order) => {
      const enrichedOrderItems = await Promise.all(
        order.orderItems.map(async (item) => {
          const fooditem = await Fooditem.findById(item.fooditem);
          const chef = await Chef.findById(item.chef);

          return {
            ...item.toObject(),
            image: fooditem ? fooditem.image : item.image,
            kitchenName: chef ? chef.kitchenName : item.kitchenName,
          };
        })
      );

      return {
        ...order.toObject(),
        orderItems: enrichedOrderItems,
      };
    })
  );

  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({}).populate("user", "id name");

  // Enrich orderItems with fooditem image and chef kitchenName
  orders = await Promise.all(
    orders.map(async (order) => {
      const enrichedOrderItems = await Promise.all(
        order.orderItems.map(async (item) => {
          const fooditem = await Fooditem.findById(item.fooditem);
          const chef = await Chef.findById(item.chef);

          return {
            ...item.toObject(),
            image: fooditem ? fooditem.image : item.image,
            kitchenName: chef ? chef.kitchenName : item.kitchenName,
            chefName: chef ? chef.name : "N/A",
          };
        })
      );

      return {
        ...order.toObject(),
        orderItems: enrichedOrderItems,
      };
    })
  );

  res.json(orders);
});

// @desc    Get orders for a specific chef
// @route   GET /api/orders/chef
// @access  Private
const getOrdersForChef = asyncHandler(async (req, res) => {
  const chefId = req.user._id;

  // Find orders where orderItems contain items for this chef
  const orders = await Order.find({ "orderItems.chef": chefId }).populate(
    "user",
    "name address"
  );

  // Filter orderItems to only include items for this chef
  const filteredOrders = orders.map((order) => {
    const chefOrderItems = order.orderItems.filter(
      (item) => item.chef.toString() === chefId.toString()
    );
    return {
      _id: order._id,
      user: order.user,
      orderItems: chefOrderItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  });

  res.json(filteredOrders);
});

// @desc    Update status of an order item by chef
// @route   PUT /api/orders/:orderId/item/:itemId/status
// @access  Private
const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;
  const chefId = req.user._id;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Find the order item
  const orderItem = order.orderItems.id(itemId);

  if (!orderItem) {
    res.status(404);
    throw new Error("Order item not found");
  }

  // Check if the order item belongs to the logged-in chef
  if (orderItem.chef.toString() !== chefId.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this order item");
  }

  // Update status
  orderItem.status = status;

  await order.save();

  res.json({ message: "Order item status updated", orderItem });
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrdersForChef,
  updateOrderItemStatus,
};
