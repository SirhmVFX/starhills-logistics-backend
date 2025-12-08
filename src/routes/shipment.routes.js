import express from "express";
import {
  cancelShipment,
  createShipment,
  getShipmentById,
  getShipments,
  getShipmentStatistics,
  getShipmentWaybill,
} from "../controllers/shipment.controllers.js";

const router = express.Router();

router.post("/create", createShipment);
router.get("/", getShipments);
router.get("/:shipmentId", getShipmentById);
router.delete("/:shipmentId", cancelShipment);
router.get("/:shipmentId/waybill", getShipmentWaybill);
router.get("/statistics", getShipmentStatistics);

export default router;
