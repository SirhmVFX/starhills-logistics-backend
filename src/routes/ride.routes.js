import express from "express";
import {
  acceptRide,
  cancelRide,
  createRide,
  getRide,
  rateRide,
  trackRide,
} from "../controllers/ride.controller.js";
const router = express.Router();

router.post("/rides", createRide);
router.get("/rides/:id", getRide);
router.put("/rides/:id/accept", acceptRide);
router.put("/rides/:id/cancel", cancelRide);
router.put("/rides/:id/track", trackRide);
router.put("/rides/:id/rate", rateRide);

export default router;
