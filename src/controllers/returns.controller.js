// src/controllers/returns.controller.js
import {
  createReturnService,
  getReturnByIdService,
  getReturnRatesService,
  getReturnsService,
} from "../services/return.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getReturnRates = async (req, res) => {
  try {
    await getReturnRatesService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const createReturn = async (req, res) => {
  try {
    await createReturnService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getReturns = async (req, res) => {
  try {
    await getReturnsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getReturnById = async (req, res) => {
  try {
    await getReturnByIdService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
