import express from "express";
import {
  getInsuranceRates,
  getPackageCategories,
  getPackageDimensions,
  validateCashonDelivery,
} from "../controllers/package.controller.js";

const router = express.Router();

router.get("/categories", getPackageCategories);
router.get("/dimensions", getPackageDimensions);
router.get("/insurance-rates", getInsuranceRates);
router.get("/validate-cash-on-delivery", validateCashonDelivery);

export default router;
