import prisma from "../prismaClient.js";
import { makeShipbubbleRequest } from "./shipbubble.service.js";

function calculateEstimatedDelivery(orderDate) {
  if (!orderDate) return null;

  const date = new Date(orderDate);
  // Add 3-7 business days as default estimate
  const businessDays = 5;
  const estimated = new Date(date);
  estimated.setDate(estimated.getDate() + businessDays);
  return estimated;
}

export const createShipmentService = async (req, res) => {
  return await prisma.$transaction(async (prisma) => {
    try {
      // First, verify we have the required request_token
      if (!req.body.request_token) {
        return res.status(400).json({
          success: false,
          message: "Request token is required. Please calculate rates first.",
        });
      }

      // Check wallet balance
      const wallet = await prisma.wallet.findUnique({
        where: { userId: req.user.id },
      });

      const shipmentCost = parseFloat(req.body.amount);
      if (isNaN(shipmentCost) || shipmentCost <= 0) {
        return res.status(400).json({
          success: false,
          message: "A valid amount greater than 0 is required",
        });
      }

      if (!wallet || parseFloat(wallet.balance) < shipmentCost) {
        return res.status(400).json({
          success: false,
          message:
            "Insufficient wallet balance. Please fund your wallet to complete this transaction.",
          requiredAmount: shipmentCost,
          currentBalance: parseFloat(wallet?.balance) || 0,
        });
      }

      // Create shipment via Shipbubble API
      const result = await makeShipbubbleRequest(
        "/shipping/labels",
        "POST",
        req.body
      );

      if (!result.data || !result.data.order_id) {
        console.error("Invalid Shipbubble API response:", result);
        return res.status(400).json({
          success: false,
          message: "Invalid response from shipping provider",
          details: result.data || result,
        });
      }

      const {
        order_id,
        courier,
        status,
        ship_from,
        ship_to,
        payment,
        items,
        tracking_url,
        date,
      } = result.data;

      const trackingNumber = String(order_id);
      if (!trackingNumber) {
        return res.status(400).json({
          success: false,
          message: "No tracking number received from shipping provider",
        });
      }

      // Parse coordinates from ship_from and ship_to
      const senderCoordinates =
        ship_from?.latitude && ship_from?.longitude
          ? JSON.stringify({
              latitude: parseFloat(ship_from.latitude),
              longitude: parseFloat(ship_from.longitude),
            })
          : null;

      const receiverCoordinates =
        ship_to?.latitude && ship_to?.longitude
          ? JSON.stringify({
              latitude: parseFloat(ship_to.latitude),
              longitude: parseFloat(ship_to.longitude),
            })
          : null;

      // Save shipment to database with all Shipbubble data
      const shipment = await prisma.shipment.create({
        data: {
          courierServiceCode: req.body.service_code,
          requestToken: req.body.request_token,
          trackingNumber,
          shipbubbleId: order_id,
          trackingUrl: tracking_url,
          user: { connect: { id: req.user.id } },

          // Sender info (prioritize Shipbubble response)
          senderName: ship_from?.name || req.body.sender_name,
          senderPhone: ship_from?.phone || req.body.sender_phone,
          senderEmail: ship_from?.email || req.body.sender_email,
          senderAddress: ship_from?.address || req.body.sender_address,
          senderCity: req.body.sender_city,
          senderState: req.body.sender_state,
          senderCountry: req.body.sender_country,
          senderCoordinates: senderCoordinates,

          // Receiver info (prioritize Shipbubble response)
          receiverName: ship_to?.name || req.body.receiver_name,
          receiverPhone: ship_to?.phone || req.body.receiver_phone,
          receiverEmail: ship_to?.email || req.body.receiver_email,
          receiverAddress: ship_to?.address || req.body.receiver_address,
          receiverCity: req.body.receiver_city,
          receiverState: req.body.receiver_state,
          receiverCountry: req.body.receiver_country,
          receiverCoordinates: receiverCoordinates,

          // Shipment details
          courierId: req.body.courier_id,
          weight: parseFloat(req.body.weight) || 0,
          dimension: req.body.dimension,
          category: req.body.category,
          description: req.body.description,
          items: items || req.body.items || [],
          codAmount: parseFloat(req.body.cod_amount) || 0,
          insuranceCode: req.body.insurance_code,

          // Status and dates
          status: status || "created",
          dateCreated: date ? new Date(date) : new Date(),
          lastUpdated: new Date(),

          // Payment info
          waybillUrl: result.data.waybill_url || tracking_url,
          amount: parseFloat(payment?.shipping_fee) || shipmentCost || 0,

          // Additional Shipbubble data
          courierInfo: courier ? JSON.stringify(courier) : null,
          paymentInfo: payment ? JSON.stringify(payment) : null,

          // Calculate estimated delivery (if available from courier)
          estimatedDelivery: result.data.estimated_delivery
            ? new Date(result.data.estimated_delivery)
            : calculateEstimatedDelivery(date), // You need to implement this function
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: req.user.id,
          type: "shipment_created",
          title: "Shipment Created",
          message: `Your shipment ${trackingNumber} has been created successfully`,
          data: {
            shipmentId: shipment.id,
            trackingUrl: tracking_url,
            courier: courier,
            estimatedDelivery: shipment.estimatedDelivery,
          },
        },
      });

      // Deduct from wallet if payment type is wallet
      if (payment?.type === "wallet" && payment?.status === "completed") {
        const deductionAmount =
          parseFloat(payment.shipping_fee) || shipmentCost;

        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              decrement: deductionAmount,
            },
          },
        });

        // Record transaction
        await prisma.transaction.create({
          data: {
            walletId: wallet.id,
            amount: deductionAmount,
            type: "DEBIT",
            reference: `SHIP-${shipment.id}`,
            status: "COMPLETED",
            description: `Shipment created: ${trackingNumber}`,
            metadata: {
              shipmentId: shipment.id,
              trackingNumber: trackingNumber,
              courier: courier?.name,
              serviceCode: req.body.service_code,
            },
          },
        });
      }

      // Return the complete Shipbubble response along with our database data
      const responseData = {
        success: true,
        message: result.message || "Shipment created successfully",
        data: {
          // Shipbubble response data
          ...result.data,
          // Our database data
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
          },
          walletDeducted:
            payment?.type === "wallet"
              ? parseFloat(payment.shipping_fee) || shipmentCost
              : 0,
          createdAt: shipment.createdAt,
          estimatedDelivery: shipment.estimatedDelivery,
        },
      };

      res.status(201).json(responseData);
    } catch (error) {
      console.error("Shipment creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create shipment",
        error: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
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
    const order_id = req.params.order_id;
    const { reason } = req.body;

    // Validate input
    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    // Find the shipment in our database
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingNumber: order_id }, { shipbubbleId: order_id }],
        userId: req.user.id,
      },
      select: {
        id: true,
        trackingNumber: true,
        shipbubbleId: true,
        status: true,
      },
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found or you don't have permission to cancel it",
      });
    }

    // Check if shipment is already cancelled
    if (shipment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Shipment is already cancelled",
      });
    }

    // In cancelShipmentService, before calling Shipbubble API:
    const nonCancellableStatuses = ["in_transit", "completed", "delivered"];
    if (nonCancellableStatuses.includes(shipment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel shipment with status: ${shipment.status}. Please contact support.`,
      });
    }

    // Call Shipbubble API to cancel the shipment
    const result = await makeShipbubbleRequest(
      `/shipping/labels/cancel/${order_id}`,
      "POST",
      { reason }
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || "Failed to cancel shipment with courier",
        error: result.error,
      });
    }

    // Update the shipment status in our database
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: "cancelled",
        cancellationReason: reason,
        cancelledAt: new Date(),
        lastUpdated: new Date(),
      },
    });

    // In cancelShipmentService, after updating shipment status:
    if (shipment.status === "confirmed" || shipment.status === "picked_up") {
      // Get the shipment amount to refund
      const shipmentAmount = await prisma.shipment.findUnique({
        where: { id: shipment.id },
        select: { amount: true },
      });

      if (shipmentAmount.amount > 0) {
        // Refund to wallet
        await prisma.wallet.update({
          where: { userId: req.user.id },
          data: {
            balance: { increment: shipmentAmount.amount },
          },
        });

        // Record refund transaction
        await prisma.transaction.create({
          data: {
            walletId: wallet.id,
            amount: shipmentAmount.amount,
            type: "CREDIT",
            reference: `REFUND-${shipment.id}`,
            status: "COMPLETED",
            description: `Refund for cancelled shipment: ${shipment.trackingNumber}`,
            metadata: {
              shipmentId: shipment.id,
              originalReference: `SHIP-${shipment.id}`,
              reason: reason,
            },
          },
        });
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        type: "shipment_cancelled",
        title: "Shipment Cancelled",
        message: `Shipment ${shipment.trackingNumber} has been cancelled${reason ? `: ${reason}` : ""}`,
        data: {
          shipmentId: shipment.id,
          trackingNumber: shipment.trackingNumber,
          status: "cancelled",
        },
      },
    });

    // Return success response
    res.json({
      success: true,
      message: result.message || "Shipment cancelled successfully",
      data: {
        trackingNumber: shipment.trackingNumber,
        status: "cancelled",
        cancelledAt: updatedShipment.cancelledAt,
      },
    });
  } catch (error) {
    console.error("Error cancelling shipment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the shipment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
    console.log("User ID:", req.user?.id); // Debug log
    const { startDate, endDate } = req.query;
    console.log("Query params:", { startDate, endDate }); // Debug log

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

    console.log("Final query:", JSON.stringify(where, null, 2)); // Debug log

    const [total, delivered, inTransit, cancelled, revenueData] =
      await Promise.all([
        prisma.shipment.count({ where }),
        prisma.shipment.count({ where: { ...where, status: "delivered" } }),
        prisma.shipment.count({ where: { ...where, status: "in_transit" } }),
        prisma.shipment.count({ where: { ...where, status: "cancelled" } }),
        prisma.shipment.aggregate({
          where,
          _sum: { amount: true },
        }),
      ]);

    console.log("Query results:", {
      total,
      delivered,
      inTransit,
      cancelled,
      revenueData,
    }); // Debug log

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
