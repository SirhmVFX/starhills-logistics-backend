// src/controllers/notifications.controller.js
import {
  deleteNotificationService,
  getNotificationsService,
  markAllAsReadService,
  markAsReadService,
} from "../services/notifications.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getNotifications = async (req, res) => {
  try {
    await getNotificationsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const markAsRead = async (req, res) => {
  try {
    await markAsReadService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await markAllAsReadService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await deleteNotificationService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
