import express from "express";
import { Product } from "../models/product.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./controllers/productController.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/bestsellers", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 10;
    if (limit > 100) limit = 100;

    const bestsellers = await Product.find({})
      .sort({ salesCount: -1 })
      .limit(limit);

    return res.json({
      error: false,
      message: "Bestsellers fetched successfully",
      count: bestsellers.length,
      data: bestsellers,
    });
  } catch (err) {
    console.error("❌ Bestsellers error:", err);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch bestsellers",
    });
  }
});
router.get("/:id", getProductById); //get มาอันเดียว

router.post("/", createProduct); // รอมี admin ก่อนนะ แต่ว่าเปิดไว้เพื่อจะพัฒนาต่อ admin
router.put("/:id", updateProduct); // รอมี admin ก่อน
router.delete("/:id", deleteProduct); // รอมี admin ก่อน

router.get("/search", async (req, res) => {
  try {
    const { q, cat } = req.query;
    const filter = {};

    if (cat) filter.category = cat;

    if (q) {
      if (q.length > 100) {
        return res.status(400).json({
          error: true,
          message: "Search query too long",
        });
      }

      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { desc: regex }, { tag: regex }];
    }

    const results = await Product.find(filter).limit(50);

    return res.json({
      error: false,
      message: "Products fetched successfully",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch products",
    });
  }
});

router.get("/bestsellers", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit, 10) || 5;
    if (limit > 100) limit = 100;

    const bestsellers = await Product.find({})
      .sort({ salesCount: -1 })
      .limit(limit);

    return res.json({
      error: false,
      message: "Bestsellers fetched successfully",
      count: bestsellers.length,
      data: bestsellers,
    });
  } catch (err) {
    console.error("❌ Bestsellers error:", err);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch bestsellers",
    });
  }
});

export default router;
