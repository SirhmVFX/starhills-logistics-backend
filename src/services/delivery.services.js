import prisma from "../prismaClient.js";
import axios from "axios";

export const createDeliveryService = async (req, res) => {
  try {
    const { name, email, phone, latitude, longitude, address } = req.body;

    if (!name || !email || !phone || !latitude || !longitude || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Validate Address
    const validated = await axios.post(
      "https://api.shipbubble.com/v1/shipping/address/validate",
      { name, email, phone, latitude, longitude, address },
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    // 2. Save the request (NOT YET SHIPPED — just validated)
    const delivery = await prisma.delivery.create({
      data: {
        name,
        email,
        phone,
        latitude,
        longitude,
        address,
        validationResponse: validated.data,
        status: "address_validated",
      },
    });

    return res.status(200).json({
      message: "Address validated successfully",
      provider: "ShipBubble",
      validation: validated.data,
      delivery,
    });
  } catch (error) {
    console.error("ShipBubble Error:", error?.response?.data || error.message);
    return res.status(500).json({
      message: "Address validation failed",
      error: error?.response?.data || error.message,
    });
  }
};

export const createShipmentService = async (req, res) => {
  try {
    const { deliveryId, parcel, pickupAddressId } = req.body;

    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const response = await axios.post(
      "https://api.shipbubble.com/v1/shipping/labels",
      {
        parcel,
        pickup_address: pickupAddressId,
        receiver: {
          name: delivery.name,
          email: delivery.email,
          phone: delivery.phone,
          address: delivery.address,
          latitude: delivery.latitude,
          longitude: delivery.longitude,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    const label = response.data;

    await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        shipbubbleId: label?.id,
        trackingNumber: label?.tracking_number,
        status: "shipment_created",
        metadata: label,
      },
    });

    return res.status(200).json({
      message: "Shipment created successfully",
      shipment: label,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create shipment",
      error: error?.response?.data || error.message,
    });
  }
};

export const getDeliveryDetailsService = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    return res.status(200).json({
      message: "Delivery details fetched successfully",
      delivery,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch delivery details",
      error,
    });
  }
};

export const trackDeliveryService = async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ message: "Tracking number is required" });
    }

    const response = await axios.get(
      `https://api.shipbubble.com/v1/shipping/track/${trackingNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    return res.status(200).json({
      message: "Delivery tracked successfully",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to track delivery",
      error: error?.response?.data || error.message,
    });
  }
};

export const cancelDeliveryService = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({ where: { id } });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (!delivery.shipbubbleId) {
      return res.status(400).json({
        message: "Shipment not yet created — cannot cancel",
      });
    }

    const response = await axios.delete(
      `https://api.shipbubble.com/v1/shipping/labels/${delivery.shipbubbleId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    await prisma.delivery.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return res.status(200).json({
      message: "Delivery cancelled successfully",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel delivery",
      error: error?.response?.data || error.message,
    });
  }
};

export const rateDeliveryService = async (req, res) => {
  try {
    const { trackingNumber, rating, comment } = req.body;

    if (!trackingNumber || !rating) {
      return res
        .status(400)
        .json({ message: "Tracking number and rating are required" });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { trackingNumber },
    });
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const rate = await prisma.rating.create({
      data: {
        trackingNumber,
        rating,
        comment,
        deliveryId: delivery.id,
      },
    });

    return res.status(200).json({
      message: "Delivery rated successfully",
      rating: rate,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to rate delivery",
      error,
    });
  }
};
