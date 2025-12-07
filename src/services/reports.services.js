// src/services/reports.services.js
import prisma from "../prismaClient.js";

export const getShipmentReportService = async (req, res) => {
  try {
    const { startDate, endDate, format = "json" } = req.query;

    const where = { userId: req.user.id };
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const shipments = await prisma.shipment.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      const csv = [
        [
          "Tracking Number",
          "Status",
          "Sender",
          "Receiver",
          "Amount",
          "Created At",
        ].join(","),
        ...shipments.map((s) =>
          [
            s.trackingNumber,
            s.status,
            s.senderName,
            s.receiverName,
            s.amount,
            s.createdAt.toISOString(),
          ]
            .map((field) => `"${String(field || "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=shipments-report.csv"
      );
      return res.send(csv);
    }

    res.json({
      success: true,
      shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};

export const getRevenueReportService = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.user.id,
      status: "delivered",
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const shipments = await prisma.shipment.findMany({
      where,
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const revenueByDate = shipments.reduce((acc, shipment) => {
      const date = shipment.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + (shipment.amount || 0);
      return acc;
    }, {});

    const revenueData = Object.entries(revenueByDate).map(
      ([date, revenue]) => ({
        date,
        revenue,
      })
    );

    const totalRevenue = revenueData.reduce((sum, day) => sum + day.revenue, 0);

    res.json({
      success: true,
      totalRevenue,
      breakdown: revenueData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate revenue report",
      error: error.message,
    });
  }
};

export const getPerformanceReportService = async (req, res) => {
  try {
    const [total, delivered, inTransit] = await Promise.all([
      prisma.shipment.count({ where: { userId: req.user.id } }),
      prisma.shipment.count({
        where: {
          userId: req.user.id,
          status: "delivered",
        },
      }),
      prisma.shipment.count({
        where: {
          userId: req.user.id,
          status: "in_transit",
        },
      }),
    ]);

    const deliveredShipments = await prisma.shipment.findMany({
      where: {
        userId: req.user.id,
        status: "delivered",
        deliveredAt: { not: null },
      },
      select: {
        createdAt: true,
        deliveredAt: true,
      },
    });

    const avgDeliveryTime =
      deliveredShipments.length > 0
        ? deliveredShipments.reduce((sum, s) => {
            const deliveryTime =
              (s.deliveredAt - s.createdAt) / (1000 * 60 * 60 * 24);
            return sum + deliveryTime;
          }, 0) / deliveredShipments.length
        : 0;

    res.json({
      success: true,
      metrics: {
        totalShipments: total,
        deliveredShipments: delivered,
        inTransitShipments: inTransit,
        deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
        averageDeliveryTime: parseFloat(avgDeliveryTime.toFixed(2)) + " days",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate performance report",
      error: error.message,
    });
  }
};
