import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getPackageCategoriesService = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const result = await makeShipbubbleRequest(
      "/shipping/labels/categories",
      "GET",
      null
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      categories: result.data?.data,
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
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const result = await makeShipbubbleRequest(
      "/shipping/labels/boxes",
      "GET",
      null
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      dimensions: result.data?.data,
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
    const { request_token } = req.body;

    if (!request_token) {
      return res.status(400).json({
        success: false,
        message: "Request token is required",
      });
    }

    const result = await makeShipbubbleRequest(
      `/shipping/insurance_rates?request_token=${request_token}`,
      "GET"
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    res.json({
      success: true,
      insuranceCode: result.data.insurance_code,
      premium: result.data.premium,
      coverage: result.data.coverage,
      result: result.data?.data,
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
    const result = await makeShipbubbleRequest(
      "/shipping/cod/validate",
      "POST",
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    res.json({
      success: true,
      available: result.data.available,
      fee: result.data.fee,
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to validate COD",
      error: error.message,
    });
  }
};
