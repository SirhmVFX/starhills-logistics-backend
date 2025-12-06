import {
  getInsuranceRatesService,
  getPackageCategoriesService,
  getPackageDimensionsService,
  validateCashonDeliveryService,
} from "../services/package.controler.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getPackageCategories = async (req, res) => {
  try {
    await getPackageCategoriesService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getPackageDimensions = async (req, res) => {
  try {
    await getPackageDimensionsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getInsuranceRates = async (req, res) => {
  try {
    await getInsuranceRatesService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const validateCashonDelivery = async (req, res) => {
  try {
    await validateCashonDeliveryService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
