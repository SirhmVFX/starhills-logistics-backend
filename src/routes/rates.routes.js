import express from "express";
import {
  calculateRate,
  calculateSelectedCouriers,
  updateRateRequest,
} from "../controllers/rates.controllers.js";

const router = express.Router();

router.post("/calculate", calculateRate);
router.post("/calculate-selected-couriers", calculateSelectedCouriers);
router.put("/update-rate-request/:requestToken", updateRateRequest);

export default router;
