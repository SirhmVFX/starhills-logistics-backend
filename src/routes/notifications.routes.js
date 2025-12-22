// src/routes/notifications.routes.js
import express from "express";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:notificationId/read", markAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
