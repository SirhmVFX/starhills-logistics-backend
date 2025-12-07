import {
  calculateRateServices,
  updateRateRequestService,
} from "../services/rates.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const calculateRate = async (req, res) => {
  try {
    await calculateRateServices(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const calculateSelectedCouriers = async (req, res) => {
  try {
    await calculateSelectedCouriers(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const updateRateRequest = async (req, res) => {
  try {
    await updateRateRequestService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
