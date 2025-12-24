// src/routes/tracking.routes.js
import express from "express";
import {
  getTrackingEvents,
  trackMultipleShipments,
  trackShipment,
} from "../controllers/tracking.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/multiple", authMiddleware, trackMultipleShipments);
router.get("/:trackingNumber", authMiddleware, trackShipment);
router.get("/:trackingNumber/events", authMiddleware, getTrackingEvents);

export default router;
