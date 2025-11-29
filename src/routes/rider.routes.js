import express from "express";
import {
  getNearbyRiders,
  getRider,
  updateRiderLocation,
} from "../controllers/rider.controller.js";
const router = express.Router();

router.put("/rider/:id/location", updateRiderLocation);
router.get("/rider/:id", getRider);
router.get("/riders/nearby", getNearbyRiders);

export default router;
