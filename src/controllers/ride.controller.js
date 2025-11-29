import {
  acceptRideService,
  cancelRideService,
  createRideService,
  getRideService,
  rateRideService,
  trackRideService,
} from "../services/ride.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const createRide = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, status } = req.body;
    const ride = await createRideService({
      originLat,
      originLng,
      destLat,
      destLng,
      status,
    });
    handleResponse(res, 200, "Ride created successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getRide = async (req, res) => {
  try {
    const ride = await getRideService(req.params.id);
    handleResponse(res, 200, "Ride fetched successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const cancelRide = async (req, res) => {
  try {
    const ride = await cancelRideService(req.params.id);
    handleResponse(res, 200, "Ride cancelled successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const acceptRide = async (req, res) => {
  try {
    const ride = await acceptRideService(req.params.id);
    handleResponse(res, 200, "Ride accepted successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const trackRide = async (req, res) => {
  try {
    const ride = await trackRideService(req.params.id);
    handleResponse(res, 200, "Ride fetched successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const rateRide = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const ride = await rateRideService(req.params.id, { score, comment });
    handleResponse(res, 200, "Ride rated successfully", ride);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
