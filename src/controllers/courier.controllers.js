import {
  getCouriersByIdService,
  getCouriersService,
} from "../services/couriers.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getCouriers = async (req, res) => {
  try {
    await getCouriersService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getCouriersById = async (req, res) => {
  try {
    await getCouriersByIdService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
