import {
  cancelDeliveryService,
  createDeliveryService,
  createShipmentService,
  getDeliveryDetailsService,
  trackDeliveryService,
} from "../services/delivery.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const createDelivery = async (req, res) => {
  try {
    const { name, email, phone, latitude, longitude, address } = req.body;
    const delivery = await createDeliveryService({
      name,
      email,
      phone,
      latitude,
      longitude,
      address,
    });
    handleResponse(res, 201, "Delivery created successfully", delivery);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const trackDelivery = async (req, res) => {
  try {
    const delivery = await trackDeliveryService(req.params.id);
    handleResponse(res, 200, "Delivery fetched successfully", delivery);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const createShipment = async (req, res) => {
  try {
    const { deliveryId, parcel, pickupAddressId } = req.body;
    const shipment = await createShipmentService({
      deliveryId,
      parcel,
      pickupAddressId,
    });
    handleResponse(res, 201, "Shipment created successfully", shipment);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await getDeliveryDetailsService(req.params.id);
    handleResponse(res, 200, "Delivery details fetched successfully", delivery);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const cancelDelivery = async (req, res) => {
  try {
    const delivery = await cancelDeliveryService(req.params.id);
    handleResponse(res, 200, "Delivery cancelled successfully", delivery);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const rateDelivery = async (req, res) => {
  try {
    const delivery = await rateDeliveryService(req.params.id);
    handleResponse(res, 200, "Delivery rated successfully", delivery);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
