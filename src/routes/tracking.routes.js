// src/routes/tracking.routes.js
import express from "express";
import {
  getTrackingEvents,
  trackMultipleShipments,
  trackShipment,
} from "../controllers/tracking.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/multiple", trackMultipleShipments);
router.get("/:trackingNumber", trackShipment);
router.get("/:trackingNumber/events", getTrackingEvents);

export default router;
