// src/services/webhooks.services.js
import prisma from "../prismaClient.js";

export const handleShipbubbleWebhookService = async (req, res) => {
  try {
    const event = req.body;

    switch (event.event_type) {
      case "shipment.created":
        await prisma.shipment.updateMany({
          where: { shipbubbleId: event.data.id },
          data: { status: "created" },
        });
        break;

      case "shipment.picked_up":
        const shipment = await prisma.shipment.findFirst({
          where: { shipbubbleId: event.data.id },
        });

        if (shipment) {
          await prisma.shipment.update({
            where: { id: shipment.id },
            data: { status: "picked_up" },
          });

          await prisma.notification.create({
            data: {
              userId: shipment.userId,
              type: "shipment_picked_up",
              title: "Shipment Picked Up",
              message: `Your shipment ${shipment.trackingNumber} has been picked up`,
              data: { shipmentId: shipment.id },
            },
          });
        }
        break;

      // Add other event types as needed
      default:
        console.log("Unknown event type:", event.event_type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};

export const testWebhookService = async (req, res) => {
  try {
    const { eventType } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const apiKey = decryptData(user.shipbubbleApiKey);

    const result = await shipbubbleRequest(
      "/webhooks/simulate",
      "POST",
      { event_type: eventType },
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
      message: "Test webhook sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send test webhook",
      error: error.message,
    });
  }
};

export const getWebhookLogsService = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.webhookLog.count(),
    ]);

    res.json({
      success: true,
      logs,
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
      message: "Failed to fetch webhook logs",
      error: error.message,
    });
  }
};
