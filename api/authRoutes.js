import express from "express";
import { createAccount, login, logout, profile } from "./controllers/authController.js";
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

router.get("/me", authUser);

// router.get("/verify", verify);

export default router;
