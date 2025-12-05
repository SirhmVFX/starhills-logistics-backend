import express from "express";
import {
  getCouriers,
  getCouriersById,
} from "../controllers/courier.controllers.js";

const router = express.Router();

router.get("/", getCouriers);
router.get("/:courierId", getCouriersById);

export default router;
