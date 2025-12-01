// src/routes/promotion.routes.js
import express from "express";
import {
  createPromotion,
  getPromotion,
  getAllPromotions,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotion.controller.js";

const router = express.Router();

router.post("/", createPromotion);
router.get("/code/:code", getPromotion);
router.get("/", getAllPromotions);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
