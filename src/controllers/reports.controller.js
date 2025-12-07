// src/controllers/reports.controller.js
import {
  getPerformanceReportService,
  getRevenueReportService,
  getShipmentReportService,
} from "../services/reports.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getShipmentReport = async (req, res) => {
  try {
    await getShipmentReportService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    await getRevenueReportService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getPerformanceReport = async (req, res) => {
  try {
    await getPerformanceReportService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
