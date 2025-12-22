import express from "express";
import {
  getInsuranceRates,
  getPackageCategories,
  getPackageDimensions,
  validateCashonDelivery,
} from "../controllers/package.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/categories", authMiddleware, getPackageCategories);
router.get("/dimensions", authMiddleware, getPackageDimensions);
router.get("/insurance-rates", authMiddleware, getInsuranceRates);
router.get(
  "/validate-cash-on-delivery",
  authMiddleware,
  validateCashonDelivery
);

export default router;
