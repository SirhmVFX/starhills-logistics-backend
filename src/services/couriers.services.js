import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getCouriersService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/couriers",
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
      couriers: result.data.couriers || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch couriers",
      error: error.message,
    });
  }
};

export const getCouriersByIdService = async (req, res) => {
  try {
    const user = await prisma.user.findById(req.user.id);
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      `/shipping/couriers/${req.params.courierId}`,
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
      courier: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courier",
      error: error.message,
    });
  }
};
