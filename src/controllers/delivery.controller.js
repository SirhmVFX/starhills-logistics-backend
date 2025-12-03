import {
  cancelDeliveryService,
  createDeliveryService,
  createShipmentService,
  getCouriersService,
  getDeliveryCategoriesService,
  getDeliveryDetailsService,
  getShippingRatesService,
  rateDeliveryService,
  trackDeliveryService,
} from "../services/delivery.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const createDelivery = async (req, res) => {
  try {
    const result = await createDeliveryService(req, res);
    handleResponse(res, 200, "Delivery created successfully", result);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getShippingRates = async (req, res) => {
  try {
    const result = await getShippingRatesService(req, res);
    handleResponse(res, 200, "Rates fetched successfully", result);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const trackDelivery = async (req, res) => {
  try {
    const { trackingNumber } = req.query;
    const trackingData = await trackDeliveryService(trackingNumber);
    handleResponse(res, 200, "Delivery tracked successfully", trackingData);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const createShipment = async (req, res) => {
  try {
    await createShipmentService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getDeliveryDetails = async (req, res) => {
  try {
    await getDeliveryDetailsService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const cancelDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cancelDeliveryService(id);
    handleResponse(res, 200, "Delivery cancelled successfully", result);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const rateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const result = await rateDeliveryService(id, req.user.id, {
      rating,
      comment,
    });
    handleResponse(res, 200, "Delivery rated successfully", result);
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;
    handleResponse(res, status, error.message, null);
  }
};

export const getCouriers = async (req, res) => {
  try {
    const response = await getCouriersService(res);
    handleResponse(res, 200, "Couriers retrieved successfully", response.data);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getDeliveryCategories = async (req, res) => {
  try {
    const response = await getDeliveryCategoriesService(res);
    handleResponse(
      res,
      200,
      "Delivery categories retrieved successfully",
      response.data
    );
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
