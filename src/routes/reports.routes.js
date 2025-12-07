// src/routes/reports.routes.js
import express from "express";
import {
  getPerformanceReport,
  getRevenueReport,
  getShipmentReport,
} from "../controllers/reports.controller.js";

const router = express.Router();

router.get("/shipments", getShipmentReport);
router.get("/revenue", getRevenueReport);
router.get("/performance", getPerformanceReport);

export default router;
