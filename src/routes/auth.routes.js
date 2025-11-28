import express from "express";
import cookieParser from "cookie-parser";
import {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  updatePassword,
  verifyPasswordOtp,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(cookieParser());

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-otp", verifyPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/update-password", updatePassword);
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
