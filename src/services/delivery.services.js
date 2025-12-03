import prisma from "../prismaClient.js";
import axios from "axios";

export const createDeliveryService = async (req, res) => {
  try {
    const {
      originLat,
      originLng,
      destLat,
      destLng,
      price,
      senderId,
      // Additional fields for address validation
      name,
      email,
      phone,
      latitude,
      longitude,
      address,
    } = req.body;

    if (
      !originLat ||
      !originLng ||
      !destLat ||
      !destLng ||
      !price ||
      !senderId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Validate Address

    let validationResponse = null;
    try {
      const validated = await axios.post(
        "https://api.shipbubble.com/v1/shipping/address/validate",
        {
          name: name || "Recipient",
          email: email || "no-email@example.com",
          phone: phone || "+2340000000000",
          latitude: destLat,
          longitude: destLng,
          address: address || "No address provided",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
          },
        }
      );
      validationResponse = validated.data;
    } catch (error) {
      console.error("Address validation warning:", error.message);
      // Continue even if validation fails, as it's not critical for the delivery creation
    }

    // 2. Save the request (NOT YET SHIPPED — just validated)
    const delivery = await prisma.delivery.create({
      data: {
        originLat,
        originLng,
        destLat,
        destLng,
        price: parseFloat(price),
        status: "PENDING",
        sender: {
          connect: { id: senderId },
        },
        // Store additional info in metadata
        metadata: {
          recipient: {
            name,
            email,
            phone,
            address,
            validationResponse,
          },
        },
      },
    });

    return {
      success: true,
      message: "Delivery created successfully",
      data: delivery,
      validation: validationResponse,
    };
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
    const {
      sender_address_code,
      reciever_address_code,
      pickup_date,
      category_id,
      package_items,
      package_dimension,
      service_type,
      delivery_instructions,
      request_token, // Added this line
      pickup_address, // Added this line
      courier_id, // Added with default value
      service_code,
    } = req.body;

    // Combine all validations into a single check
    const requiredFields = {
      sender_address_code,
      reciever_address_code,
      pickup_date,
      category_id,
      package_items,
      package_dimension,
      service_type,
      delivery_instructions,
      request_token, // Added to required fields
      pickup_address, // Added to required fields
      courier_id,
      service_code,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.id },
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    const recipient = delivery.metadata?.recipient;

    const response = await axios.post(
      "https://api.shipbubble.com/v1/shipping/labels",
      {
        request_token, // Changed from requestToken
        pickup_address, // Changed from pickupAddressId
        courier_id,
        service_code,
        receiver: {
          name: recipient?.name,
          email: recipient?.email,
          phone: recipient?.phone,
          address: recipient?.address,
          latitude: delivery.destLat,
          longitude: delivery.destLng,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    const label = response.data;

    const updatedDelivery = await prisma.delivery.update({
      where: { id: req.params.id },
      data: {
        shipbubbleId: label?.id,
        trackingNumber: label?.tracking_number,
        status: "ACCEPTED",
        metadata: {
          ...delivery.metadata,
          label: label.data,
        },
      },
    });

    return res.json({
      success: true,
      message: "Shipment created",
      data: updatedDelivery,
    });
  } catch (error) {
    console.error(
      "Shipment creation error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.response?.data || error.message,
    });
  }
};

export const getShippingRatesService = async (req, res) => {
  try {
    const {
      sender_address_code,
      reciever_address_code,
      pickup_date,
      category_id,
      package_items,
      package_dimension,
      service_type,
      delivery_instructions,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!sender_address_code) missingFields.push("sender_address_code");
    if (!reciever_address_code) missingFields.push("reciever_address_code");
    if (!pickup_date) missingFields.push("pickup_date");
    if (!category_id) missingFields.push("category_id");
    if (
      !package_items ||
      !Array.isArray(package_items) ||
      package_items.length === 0
    )
      missingFields.push("package_items");
    if (!package_dimension) missingFields.push("package_dimension");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Call Shipbubble fetch rates API
    const response = await axios.post(
      "https://api.shipbubble.com/v1/shipping/fetch_rates",
      {
        sender_address_code,
        reciever_address_code,
        pickup_date,
        category_id,
        package_items,
        package_dimension,
        service_type,
        delivery_instructions,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    // Return response to client
    return res.status(200).json({
      success: true,
      message: "Shipping rates fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching shipping rates:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipping rates",
      error: error.response?.data || error.message,
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
      return res
        .status(400)
        .json({ success: false, message: "Tracking number is required" });
    }

    // Call Shipbubble's labels endpoint to get shipment info
    const response = await axios.get(
      `https://api.shipbubble.com/v1/shipping/labels/${trackingNumber}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    // Send the data back to the client
    return res.status(200).json({
      success: true,
      message: "Shipment tracked successfully",
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to track delivery",
      error: error.response?.data || error.message,
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

    return updated;
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel delivery",
      error: error?.response?.data || error.message,
    });
  }
};

export const rateDeliveryService = async (
  deliveryId,
  userId,
  { rating, comment }
) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
  });
  if (!delivery) throw new Error("Delivery not found");

  return prisma.rating.create({
    data: {
      deliveryId,
      userId,
      rating,
      comment,
    },
  });
};

export const getCouriersService = async (res) => {
  try {
    const response = await axios.get(
      "https://api.shipbubble.com/v1/shipping/couriers",
      {
        headers: {
          Authorization: `Bearer ${process.env.SHIPBUBBLE_API_KEY}`,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Couriers retrieved successfully",
      data: response.data.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve couriers",
      error: error?.response?.data || error.message,
    });
  }
};
