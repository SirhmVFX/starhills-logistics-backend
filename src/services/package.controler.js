import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getPackageCategoriesService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/categories",
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
      categories: result.data.categories || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getPackageDimensionsService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/dimensions",
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
      dimensions: result.data.dimensions || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dimensions",
      error: error.message,
    });
  }
};

export const getInsuranceRatesService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/insurance/rates",
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
      insuranceCode: result.data.insurance_code,
      premium: result.data.premium,
      coverage: result.data.coverage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance rates",
      error: error.message,
    });
  }
};

export const validateCashonDeliveryService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/cod/validate",
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
      available: result.data.available,
      fee: result.data.fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to validate COD",
      error: error.message,
    });
  }
};
