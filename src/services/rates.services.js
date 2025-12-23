import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const calculateRateServices = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      "sender_address_code",
      "reciever_address_code",
      "pickup_date",
      "category_id",
      "package_items",
      "package_dimension",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate package_items
    if (
      !Array.isArray(req.body.package_items) ||
      req.body.package_items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "package_items must be a non-empty array",
      });
    }

    // Validate package_dimension
    const { package_dimension } = req.body;
    if (
      !package_dimension ||
      typeof package_dimension !== "object" ||
      !package_dimension.length ||
      !package_dimension.width ||
      !package_dimension.height
    ) {
      return res.status(400).json({
        success: false,
        message:
          "package_dimension must be an object with length, width, and height",
      });
    }

    // Prepare the request payload
    const payload = {
      ...req.body,
      // Ensure numeric values are properly formatted
      package_dimension: {
        length: Number(package_dimension.length),
        width: Number(package_dimension.width),
        height: Number(package_dimension.height),
      },
      package_items: req.body.package_items.map((item) => ({
        ...item,
        unit_weight: String(item.unit_weight),
        unit_amount: String(item.unit_amount),
        quantity: String(item.quantity),
      })),
    };

    // Make the API request
    const result = await makeShipbubbleRequest(
      "/shipping/fetch_rates",
      "POST",
      payload
    );

    if (!result.success) {
      console.error("Shipbubble API error:", result.error);
      return res.status(400).json({
        success: false,
        message: result.error || "Failed to calculate rates",
        details: result,
      });
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in calculateRateServices:", error);

    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);

      return res.status(error.response.status || 500).json({
        success: false,
        message: error.response.data?.message || "Failed to calculate rates",
        errors: error.response.data?.errors,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      return res.status(500).json({
        success: false,
        message: "No response from the shipping service",
      });
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error setting up the request",
        error: error.message,
      });
    }
  }
};

export const calculateSelectedCouriersService = async (req, res) => {
  try {
    const result = await makeShipbubbleRequest(
      "/shipping/fetch_rates/selected",
      "POST",
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      rates: result,
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
    const result = await makeShipbubbleRequest(
      `/shipping/fetch_rates/${req.params.requestToken}`,
      "PUT",
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
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update rate request",
      error: error.message,
    });
  }
};
