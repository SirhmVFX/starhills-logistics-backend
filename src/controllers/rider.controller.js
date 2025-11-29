import {
  getNearbyRidersService,
  getRiderService,
  updateRiderLocationService,
} from "../services/rider.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const updateRiderLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const riderId = req.params.id;
    const rider = await updateRiderLocationService(riderId, {
      latitude,
      longitude,
    });

    handleResponse(res, 200, "Rider location updated successfully", rider);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getRider = async (req, res) => {
  try {
    const rider = await getRiderService(req.params.id);
    handleResponse(res, 200, "Rider fetched successfully", rider);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const getNearbyRiders = async (req, res) => {
  try {
    const rider = await getNearbyRidersService(req.params.id);
    handleResponse(res, 200, "Rider fetched successfully", rider);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
