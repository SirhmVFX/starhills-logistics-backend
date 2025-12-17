import prisma from "../prismaClient.js";

import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getWalletBalanceService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    if (!user.shipbubbleApiKey) {
      return res.status(400).json({
        success: false,
        message: "Please configure your Shipbubble API key first",
      });
    }

    const apiKey = decryptData(user.shipbubbleApiKey);
    const result = await makeShipbubbleRequest(
      "/wallet/balance",
      "GET",
      null,
      apiKey
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      balance: result.data.balance,
      currency: result.data.currency || "NGN",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balance",
      error: error.message,
    });
  }
};

export const requestFundService = async (req, res) => {
  try {
    const { amount, currency = "NGN" } = req.body;

    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/wallet/fund",
      "POST",
      { amount, currency },
      apiKey
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      message: "Funding request created",
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create funding request",
      error: error.message,
    });
  }
};

export const getWalletTransactionsService = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      `/wallet/transactions?page=${page}&limit=${limit}`,
      "GET",
      null,
      apiKey
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      transactions: result.data.transactions || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.data.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
