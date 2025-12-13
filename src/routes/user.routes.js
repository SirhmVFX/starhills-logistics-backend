import express from "express";
import {
  changePassword,
  deleteAccount,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", authMiddleware, getUser);
router.patch("/me/update", authMiddleware, updateUser);
router.delete("/me/delete", authMiddleware, deleteAccount);
router.put("/me/change-password", authMiddleware, changePassword);
// router.get("/me/shipbubble-key", authMiddleware, getShipbubbleKey);
// router.put("/me/shipbubble-key", authMiddleware, saveShipbubbleKey);
export default router;
