import express from "express";
import {
  getWalletBalance,
  getWalletTransactions,
  requestFund,
} from "../controllers/wallet.controller.js";
const router = express.Router();

router.post("/balance", getWalletBalance);
router.post("/fund-request", requestFund);
router.post("/transactions", getWalletTransactions);

export default router;
