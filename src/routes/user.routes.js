import express from "express";
import {
  getUser,
  updateUser,
  uploadProfilePicture,
  uploadProfilePictureHandler,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", authMiddleware, getUser);
router.put("/me/update", authMiddleware, updateUser);
router.post(
  "/me/upload-picture",
  authMiddleware,
  uploadProfilePictureHandler,
  uploadProfilePicture
);

export default router;
