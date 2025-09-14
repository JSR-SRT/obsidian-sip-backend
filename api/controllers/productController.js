import { Product } from "../../models/product.js";

export const getProducts = async (req, res) => {
  const { category, limit } = req.query;
  const filter = {};
  if (category) filter.category = category;

  try {
    const products = await Product.find(filter).limit(parseInt(limit || 0));
    return res.json({
      error: false,
      products,
      message: "Product fetched successfully ✅",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: true, message: "Failed to fetch all products ❌ " });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ id });
    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    return res.json({
      error: false,
      product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { id, name, price, img } = req.body;
  if (!id || !name || !price || !img) {
    return res
      .status(400)
      .json({ error: true, message: "Id, name, price, and img are required" });
  }
  try {
    const product = new Product(req.body);
    await product.save();
    return res.status(201).json({
      error: false,
      product,
      message: "Product created successfully ✅",
    });
  } catch (err) {
    return res.status(400).json({ error: true, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, desc, category, price, img, tag, inStock, salesCount } =
    req.body;
  if (
    !name &&
    !desc &&
    !category &&
    !price &&
    !img &&
    !tag &&
    typeof inStock !== "boolean" &&
    salesCount === undefined
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
        ...(name && { name }),
        ...(desc && { desc }),
        ...(category && { category }),
        ...(price && { price }),
        ...(img && { img }),
        ...(tag && { tag }),
        ...(typeof inStock === "boolean" && { inStock }),
        ...(salesCount !== undefined && { salesCount }),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    return res.json({
      error: false,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Product.findOneAndDelete({ id });
    if (!deleted) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found" });
    }

    return res.json({
      error: false,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
