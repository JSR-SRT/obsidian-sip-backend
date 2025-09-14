import express from "express";
import authRoutes from "./authRoutes.js";
import { getAllUsers } from "./controllers/authController.js";
import productsRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/products", productsRoutes);
router.get("/users", getAllUsers);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/orders", orderRoutes);

export default router;
