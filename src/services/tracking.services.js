// src/services/tracking.services.js
import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const trackShipmentService = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      `/shipping/track/${req.params.trackingNumber}`,
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

    // Update local database
    await prisma.shipment.updateMany({
      where: {
        trackingNumber: req.params.trackingNumber,
        userId: req.user.id,
      },
      data: {
        status: result.data.status,
        currentLocation: result.data.current_location,
        estimatedDelivery: result.data.estimated_delivery,
        lastUpdated: new Date(),
      },
    });

    res.json({
      success: true,
      status: result.data.status,
      events: result.data.events || [],
      currentLocation: result.data.current_location,
      estimatedDelivery: result.data.estimated_delivery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to track shipment",
      error: error.message,
    });
  }
};

export const trackMultipleShipmentsService = async (req, res) => {
  try {
    const { trackingNumbers } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/track/multiple",
      "POST",
      { tracking_numbers: trackingNumbers },
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
      shipments: result.data.shipments || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to track shipments",
      error: error.message,
    });
  }
};

export const getTrackingEventsService = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      `/shipping/track/${req.params.trackingNumber}`,
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
      events: result.data.events || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tracking events",
      error: error.message,
    });
  }
};
