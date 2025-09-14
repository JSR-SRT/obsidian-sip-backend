import express from "express";
import { authMiddleware, createAccount, login, logout, profile, verify } from "./controllers/authController.js";
import { authUser } from "../middleware/auth.js";
import { refreshToken } from "./controllers/refreshTokenController.js";
import { getAuthStatus } from "./controllers/authStatusController.js";

const router = new express.Router();

router.post("/register", createAccount);

router.post("/login", login);

router.post("/token", refreshToken);

router.get("/status", getAuthStatus);

router.post("/logout", logout);

router.get("/profile", authUser, profile);

// Verify token
router.get("/verify", verify);

router.get("/me", authUser, authMiddleware);

export default router;
