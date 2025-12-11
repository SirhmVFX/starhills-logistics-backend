// src/controllers/webhooks.controller.js
import {
  getWebhookLogsService,
  handleShipbubbleWebhookService,
  testWebhookService,
} from "../services/webhooks.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const handleShipbubbleWebhook = async (req, res) => {
  try {
    await handleShipbubbleWebhookService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const testWebhook = async (req, res) => {
  try {
    await testWebhookService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getWebhookLogs = async (req, res) => {
  try {
    await getWebhookLogsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
