import express from "express";
import {
  cancelDelivery,
  createDelivery,
  createShipment,
  getDeliveryDetails,
  rateDelivery,
  trackDelivery,
} from "../controllers/delivery.controller.js";
const router = express.Router();

router.post("/deliveries", createDelivery);
router.get("/deliveries/:id/track", trackDelivery);
router.post("/deliveries/:id/shipments", createShipment);
router.get("/deliveries/:id", getDeliveryDetails);
router.delete("/deliveries/:id", cancelDelivery);
router.post("/deliveries/:id/rate", rateDelivery);

export default router;
