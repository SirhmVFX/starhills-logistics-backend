// src/controllers/tracking.controller.js
import {
  getTrackingEventsService,
  trackMultipleShipmentsService,
  trackShipmentService,
} from "../services/tracking.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const trackShipment = async (req, res) => {
  try {
    await trackShipmentService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const trackMultipleShipments = async (req, res) => {
  try {
    await trackMultipleShipmentsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getTrackingEvents = async (req, res) => {
  try {
    await getTrackingEventsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
