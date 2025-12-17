import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const calculateRateServices = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/fetch_rates",
      "POST",
      req.body,
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
      rates: result.data.rates || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate rates",
      error: error.message,
    });
  }
};

export const calculateSelectedCouriersService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/fetch_rates/selected",
      "POST",
      req.body,
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
      rates: result.data.rates || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate rates",
      error: error.message,
    });
  }
};

export const updateRateRequestService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      `/shipping/fetch_rates/${req.params.requestToken}`,
      "PUT",
      req.body,
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
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update rate request",
      error: error.message,
    });
  }
};
