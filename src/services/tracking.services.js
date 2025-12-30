// src/services/tracking.services.js
import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const trackShipmentService = async (req, res) => {
  const trackingNumber = req.params.trackingNumber;

  // Fetch all shipments from Shipbubble
  const response = await makeShipbubbleRequest("/shipping/labels", "GET", null);

  // Get all shipments from the response
  const allShipments = response.data.data.results;

  // Search for shipment where order_id matches the tracking number
  const foundShipment = allShipments.find(
    (shipment) => shipment.order_id === trackingNumber
  );

  return res.json({
    success: true,
    message: "Shipment found successfully",

    data: foundShipment,
  });
};

export const trackMultipleShipmentsService = async (req, res) => {
  try {
    const { trackingNumbers } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const result = await makeShipbubbleRequest(
      "/shipping/track/multiple",
      "POST",
      { tracking_numbers: trackingNumbers }
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

    const result = await makeShipbubbleRequest(
      `/shipping/track/${req.params.trackingNumber}`,
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
