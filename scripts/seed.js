import dotenv from "dotenv";
import mongoose from "mongoose";
import { MenuItem } from "../data/MenuData.js";
import { Product } from "../models/product.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();

    await Product.insertMany(MenuItem);

    console.log(" Products seeded successfully ✅");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
