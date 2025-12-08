// src/routes/returns.routes.js
import express from "express";
import {
  createReturn,
  getReturnById,
  getReturnRates,
  getReturns,
} from "../controllers/returns.controller.js";

const router = express.Router();

router.get("/rates", getReturnRates);
router.post("/", createReturn);
router.get("/", getReturns);
router.get("/:returnId", getReturnById);

export default router;
