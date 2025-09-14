import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: String,
    category: String,
    price: Number,
    tag: String,
    img: String,
    inStock: { type: Boolean, default: true },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
