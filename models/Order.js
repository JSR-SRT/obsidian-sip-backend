// /models/Order.js
import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },

    customerInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },

    basketItems: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // อ้างอิง Product
        name: { type: String, required: true },   // snapshot ของชื่อสินค้า
        price: { type: Number, required: true },  // snapshot ของราคาตอนสั่งซื้อ
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    orderType: {
      type: String,
      enum: ["dinein", "pickup", "delivery"],
      required: true,
    },

    address: { type: String, default: "N/A" },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    note: { type: String, default: "" },

    status: {
      type: String,
      enum: ["preparing", "processing", "shipped", "delivered"],
      default: "preparing",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);

// collection = "orders"

