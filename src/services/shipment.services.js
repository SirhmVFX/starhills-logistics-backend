import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const createShipmentService = async (req, res) => {
  try {
    // Create shipment via Shipbubble API
    const result = await makeShipbubbleRequest(
      "/shipping/labels",
      "POST",
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    // Save shipment to database
    const shipment = await prisma.shipment.create({
      userId: req.user.id,
      trackingNumber: result.data.tracking_number,
      shipbubbleId: result.data.id,
      senderName: req.body.sender_name,
      senderPhone: req.body.sender_phone,
      senderEmail: req.body.sender_email,
      senderAddress: req.body.sender_address,
      senderCity: req.body.sender_city,
      senderState: req.body.sender_state,
      senderCountry: req.body.sender_country,
      receiverName: req.body.receiver_name,
      receiverPhone: req.body.receiver_phone,
      receiverEmail: req.body.receiver_email,
      receiverAddress: req.body.receiver_address,
      receiverCity: req.body.receiver_city,
      receiverState: req.body.receiver_state,
      receiverCountry: req.body.receiver_country,
      courierId: req.body.courier_id,
      weight: req.body.weight,
      dimension: req.body.dimension,
      category: req.body.category,
      description: req.body.description,
      items: req.body.items,
      codAmount: req.body.cod_amount,
      insuranceCode: req.body.insurance_code,
      status: "created",
      waybillUrl: result.data.waybill_url,
      amount: result.data.amount,
    });

    // Create notification
    await prisma.notification.create({
      userId: req.user.id,
      type: "shipment_created",
      title: "Shipment Created",
      message: `Your shipment ${result.data.tracking_number} has been created successfully`,
      data: { shipmentId: shipment._id },
    });

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment,
      trackingNumber: result.data.tracking_number,
      waybillUrl: result.data.waybill_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.message,
    });
  }
};

export const getShipmentsServices = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit),
        skip: skip,
      }),
      prisma.shipment.count({ where }),
    ]);
    res.json({
      success: true,
      shipments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getShipmentsServices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shipments",
      error: error.message,
    });
  }
};

export const getShipmentByIdService = async (req, res) => {
  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: req.params.shipmentId,
        userId: req.user.id,
      },
    });
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }
    res.json({
      success: true,
      shipment,
    });
  } catch (error) {
    console.error("Error in getShipmentByIdService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shipment",
      error: error.message,
    });
  }
};

export const cancelShipmentService = async (req, res) => {
  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: req.params.shipmentId,
        userId: req.user.id,
      },
    });
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const apiKey = decryptData(user.shipbubbleApiKey);
    const result = await makeShipbubbleRequest(
      `/shipping/labels/${shipment.shipbubbleId}/cancel`,
      "POST",
      { reason: req.body.reason },
      apiKey
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: "cancelled",
        cancellationReason: req.body.reason,
        cancelledAt: new Date(),
      },
    });
    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: "shipment_cancelled",
        title: "Shipment Cancelled",
        message: `Shipment ${shipment.trackingNumber} has been cancelled`,
        data: { shipmentId: shipment.id },
      },
    });
    res.json({
      success: true,
      message: "Shipment cancelled successfully",
      shipment: updatedShipment,
    });
  } catch (error) {
    console.error("Error in cancelShipmentService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel shipment",
      error: error.message,
    });
  }
};

export const getShipmentWaybillService = async (req, res) => {
  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: req.params.shipmentId,
        userId: req.user.id,
      },
      select: {
        waybillUrl: true,
      },
    });
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }
    res.json({
      success: true,
      waybillUrl: shipment.waybillUrl,
    });
  } catch (error) {
    console.error("Error in getShipmentWaybillService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch waybill",
      error: error.message,
    });
  }
};

export const getShipmentStatisticsService = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.user.id,
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const total = await prisma.shipment.count({ where });
    const delivered = await prisma.shipment.count({
      where: { ...where, status: "delivered" },
    });
    const inTransit = await prisma.shipment.count({
      where: { ...where, status: "in_transit" },
    });
    const cancelled = await prisma.shipment.count({
      where: { ...where, status: "cancelled" },
    });

    const revenueData = await prisma.shipment.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    const revenue = revenueData._sum.amount || 0;

    res.json({
      success: true,
      statistics: {
        total,
        delivered,
        inTransit,
        cancelled,
        revenue,
        deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error("Error in getShipmentStatisticsService:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
