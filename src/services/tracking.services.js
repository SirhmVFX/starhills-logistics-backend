// src/services/tracking.services.js
import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const trackShipmentService = async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;

    // Find shipment in our database
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [
          { trackingNumber: trackingNumber },
          { shipbubbleId: trackingNumber },
        ],
        userId: req.user.id,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found in our records",
      });
    }

    // Fetch all shipments from Shipbubble
    const result = await makeShipbubbleRequest("/shipping/labels", "GET", null);

    if (!result.success || !result.data?.results) {
      // If API fails, return local data
      return res.json({
        success: true,
        trackingUrl: shipment.trackingUrl,
        status: shipment.status,
        message: "Using cached tracking information",
        lastUpdated: shipment.lastUpdated,
      });
    }

    // Find matching shipment in Shipbubble response
    const matchedShipment = result.data.results.find(
      (item) => item.order_id === shipment.shipbubbleId
    );

    if (!matchedShipment) {
      return res.json({
        success: true,
        trackingUrl: shipment.trackingUrl,
        status: shipment.status,
        message: "Shipment not found in courier system yet",
        lastUpdated: shipment.lastUpdated,
      });
    }

    // Update local database with latest info
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: matchedShipment.status,
        trackingUrl: matchedShipment.tracking_url,
        lastUpdated: new Date(),
        currentLocation: matchedShipment.events?.[0]?.location || null,
      },
    });

    // Return the tracking information
    res.json({
      success: true,
      trackingUrl: matchedShipment.tracking_url,
      status: matchedShipment.status,
      courier: matchedShipment.courier,
      events: matchedShipment.events || [],
      packageStatus: matchedShipment.package_status || [],
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track shipment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
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
