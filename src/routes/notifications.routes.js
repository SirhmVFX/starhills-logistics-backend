// src/routes/notifications.routes.js
import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notifications.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/read-all", authMiddleware, markAllAsRead);
router.put("/:notificationId/read", authMiddleware, markAsRead);
router.delete("/:notificationId", authMiddleware, deleteNotification);

export default router;
