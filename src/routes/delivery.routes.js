import express from "express";
import {
  cancelDelivery,
  createDelivery,
  createShipment,
  getDeliveryDetails,
  getShippingRates,
  rateDelivery,
  trackDelivery,
} from "../controllers/delivery.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/deliveries", authMiddleware, createDelivery);
router.get("/deliveries/track", authMiddleware, trackDelivery); // Changed to query param
router.post("/deliveries/:id/shipments", authMiddleware, createShipment);
router.post("/deliveries/rates", authMiddleware, getShippingRates);
router.get("/deliveries/:id", authMiddleware, getDeliveryDetails);
router.delete("/deliveries/:id", authMiddleware, cancelDelivery);
router.post("/deliveries/:id/rate", authMiddleware, rateDelivery);

export default router;
