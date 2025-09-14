import express from "express";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "./controllers/userController.js";
import { authUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authUser, getProfile);

router.put("/update", authUser, updateProfile);

router.delete("/delete", authUser, deleteProfile);

export default router;
