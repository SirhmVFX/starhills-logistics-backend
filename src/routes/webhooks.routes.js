// src/routes/webhooks.routes.js
import express from "express";
import {
  getWebhookLogs,
  handleShipbubbleWebhook,
  testWebhook,
} from "../controllers/webhooks.controller.js";

const router = express.Router();

// Public endpoint for Shipbubble webhooks
router.post("/shipbubble", handleShipbubbleWebhook);

// Protected endpoints
router.post("/test", testWebhook);
router.get("/logs", getWebhookLogs);

export default router;
