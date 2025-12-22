import express from "express";
import {
  getWalletBalance,
  getWalletTransactions,
  handleFundingWebhook,
  requestFund,
} from "../controllers/wallet.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/balance", authMiddleware, getWalletBalance);
router.post("/fund-request", authMiddleware, requestFund);
router.post("/transactions", authMiddleware, getWalletTransactions);
router.post("/webhook/funding", handleFundingWebhook);

export default router;
