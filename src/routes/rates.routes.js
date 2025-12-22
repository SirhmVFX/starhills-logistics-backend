import express from "express";
import {
  calculateRate,
  calculateSelectedCouriers,
  updateRateRequest,
} from "../controllers/rates.controllers.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/calculate", authMiddleware, calculateRate);
router.post(
  "/calculate-selected-couriers",
  authMiddleware,
  calculateSelectedCouriers
);
router.put(
  "/update-rate-request/:requestToken",
  authMiddleware,
  updateRateRequest
);

export default router;
