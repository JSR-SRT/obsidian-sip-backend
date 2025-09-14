// /api/controllers/ordersController.js
import dotenv from "dotenv";
import { Order } from "../../models/Order.js";

dotenv.config();

// Helper function to generate a unique order number
const generateOrderNumber = () => {
  const min = 100000;
  const max = 999999;
  return `ORD-${Math.floor(Math.random() * (max - min + 1)) + min}`;
};

// POST → create order
export const createOrder = async (req, res) => {
  try {
    // make sure auth middleware provided user
    if (!req.user?.user?._id) {
      return res.status(401).json({ error: true, message: "Not authenticated" });
    }
    const userId = req.user.user._id;
    const {
      customerInfo,
      basketItems,
      orderType,
      address,
      subtotal,
      deliveryFee = 0,
      total,
      note,
    } = req.body;

    // Improved validation
    if (
      !customerInfo ||
      !Array.isArray(items) ||
      basketItems.length === 0 ||
      !orderType ||
      subtotal == null ||
      total == null
    ) {
      return res.status(400).json({
        error: true,
        message: "Missing required order data.",
      });
    }

    // Ensure orderNumber is unique (retry a few times if collision)
    let orderNumber;
    let attempts = 0;
    while (attempts < 5) {
      orderNumber = generateOrderNumber();
      // check DB for existing orderNumber
      // small race condition still possible but reduces collision chance
      // (for 100% guarantee you'd need a DB-level retry or a different scheme)
      const exists = await Order.findOne({ orderNumber }).lean().exec();
      if (!exists) break;
      attempts++;
    }

    const newOrder = new Order({
      orderNumber,
      customerInfo,
      basketItems,
      orderType,
      address: orderType === "delivery" ? shippingAddress : "N/A",
      subtotal,
      deliveryFee: orderType === "delivery" ? deliveryFee : 0,
      total,
      note,
      user: userId,
    });

    await newOrder.save();

    res.status(201).json({
      error: false,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({
      error: true,
      message: "Server error, failed to create order.",
      details: err.message,
    });
  }
};

// GET → all orders ของ user
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user?.user?._id) {
      return res.status(401).json({ error: true, message: "Not authenticated" });
    }
    const userId = req.user.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      error: false,
      orders,
      message: "Orders fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error, failed to fetch orders.",
      details: err.message,
    });
  }
};

// GET → single order
export const getOrderById = async (req, res) => {
  try {
    if (!req.user?.user?._id) {
      return res.status(401).json({ error: true, message: "Not authenticated" });
    }
    const { orderId } = req.params;
    const userId = req.user.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: "Order not found or you do not have permission to view it.",
      });
    }

    res.status(200).json({
      error: false,
      order,
      message: "Order fetched successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error, failed to fetch order.",
      details: err.message,
    });
  }
};

// // DELETE → cancel order
// export const cancelOrder = async (req, res) => {
//   try {
//     if (!req.user?.user?._id) {
//       return res.status(401).json({ error: true, message: "Not authenticated" });
//     }
//     const { orderId } = req.params;
//     const userId = req.user.user._id;

//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, user: userId, status: { $in: ["pending", "processing"] } },
//       { status: "cancelled" },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         error: true,
//         message: "Order not found, already cancelled, or cannot be cancelled at this stage.",
//       });
//     }

//     res.status(200).json({
//       error: false,
//       message: "Order cancelled successfully.",
//       order,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: true,
//       message: "Server error, failed to cancel order.",
//       details: err.message,
//     });
//   }
// };
