import express from "express";
import {
  cancelShipment,
  createShipment,
  getShipmentById,
  getShipments,
  getShipmentStatistics,
  getShipmentWaybill,
} from "../controllers/shipment.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createShipment);
router.get("/", authMiddleware, getShipments);
router.get("/statistics", authMiddleware, getShipmentStatistics);
router.get("/:shipmentId", authMiddleware, getShipmentById);
router.post("/:shipmentId", authMiddleware, cancelShipment);
router.get("/:shipmentId/waybill", authMiddleware, getShipmentWaybill);

export default router;
