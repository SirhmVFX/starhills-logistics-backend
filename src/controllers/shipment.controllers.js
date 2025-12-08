import {
  cancelShipmentService,
  createShipmentService,
  getShipmentByIdService,
  getShipmentsServices,
  getShipmentStatisticsService,
  getShipmentWaybillService,
} from "../services/shipment.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const createShipment = async (req, res) => {
  try {
    await createShipmentService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getShipments = async (req, res) => {
  try {
    await getShipmentsServices(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getShipmentById = async (req, res) => {
  try {
    await getShipmentByIdService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const cancelShipment = async (req, res) => {
  try {
    await cancelShipmentService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getShipmentWaybill = async (req, res) => {
  try {
    await getShipmentWaybillService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getShipmentStatistics = async (req, res) => {
  try {
    await getShipmentStatisticsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
