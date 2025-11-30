import express from "express";
import {
  getWallet,
  getWalletTransactions,
  topupWallet,
  walletWebhook,
} from "../controllers/wallet.controller.js";
const router = express.Router();

router.post("/wallet/topup", topupWallet);
router.post("/wallet/webhook", walletWebhook);
router.get("/wallet", getWallet);
router.get("/wallet/transactions", getWalletTransactions);

export default router;
