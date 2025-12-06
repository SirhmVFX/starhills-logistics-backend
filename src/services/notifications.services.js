// src/services/notifications.services.js
import prisma from "../prismaClient.js";

export const getNotificationsService = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { userId: req.user.id };
    if (unreadOnly === "true") where.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: req.user.id,
          isRead: false,
        },
      }),
    ]);

    res.json({
      success: true,
      notifications,
      unreadCount,
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
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const markAsReadService = async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: req.params.notificationId,
        userId: req.user.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

export const markAllAsReadService = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all as read",
      error: error.message,
    });
  }
};

export const deleteNotificationService = async (req, res) => {
  try {
    await prisma.notification.delete({
      where: {
        id: req.params.notificationId,
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};
