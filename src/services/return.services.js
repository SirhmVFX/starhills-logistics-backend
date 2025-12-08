// src/services/returns.services.js
import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

export const getReturnRatesService = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/returns/rates",
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
      rates: result.data.rates || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch return rates",
      error: error.message,
    });
  }
};

export const createReturnService = async (req, res) => {
  try {
    const { originalShipmentId, reason, ...returnDetails } = req.body;

    const originalShipment = await prisma.shipment.findFirst({
      where: {
        id: originalShipmentId,
        userId: req.user.id,
      },
    });

    if (!originalShipment) {
      return res.status(404).json({
        success: false,
        message: "Original shipment not found",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await makeShipbubbleRequest(
      "/shipping/returns",
      "POST",
      returnDetails,
      apiKey
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    const returnShipment = await prisma.return.create({
      data: {
        userId: req.user.id,
        originalShipmentId,
        trackingNumber: result.data.tracking_number,
        shipbubbleId: result.data.id,
        reason,
        status: "created",
        waybillUrl: result.data.waybill_url,
        amount: result.data.amount,
      },
    });

    res.status(201).json({
      success: true,
      message: "Return shipment created successfully",
      returnShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create return",
      error: error.message,
    });
  }
};

export const getReturnsService = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where: { userId: req.user.id },
        include: { originalShipment: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.return.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true,
      returns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch returns",
      error: error.message,
    });
  }
};

export const getReturnByIdService = async (req, res) => {
  try {
    const returnShipment = await prisma.return.findFirst({
      where: {
        id: req.params.returnId,
        userId: req.user.id,
      },
      include: { originalShipment: true },
    });

    if (!returnShipment) {
      return res.status(404).json({
        success: false,
        message: "Return not found",
      });
    }

    res.json({
      success: true,
      return: returnShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch return",
      error: error.message,
    });
  }
};
