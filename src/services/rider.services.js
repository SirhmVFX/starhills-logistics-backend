import prisma from "../prismaClient.js";

export const updateRiderLocationService = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const riderId = req.params.id;
    if (!riderId) {
      return res.status(400).json({ message: "Rider ID is required" });
    }

    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
    });
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    const updateRider = prisma.rider.update({
      where: { id: req.user.id },
      data: { latitude, longitude },
    });

    return res.status(200).json({
      message: "Rider location updated successfully",
      rider: updateRider,
    });
  } catch (error) {}
};

export const getRiderService = async (req, res) => {
  try {
    const rider = await prisma.rider.findUnique({
      where: { id: req.user.id },
    });

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }
    return res
      .status(200)
      .json({ message: "Rider fetched successfully", rider: rider });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch rider", error: error.message });
  }
};

export const getNearbyRidersService = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;
    const nearbyRiders = await prisma.rider.findMany({
      where: {
        latitude: {
          gte: latitude - radius,
          lte: latitude + radius,
        },
        longitude: {
          gte: longitude - radius,
          lte: longitude + radius,
        },
      },
    });
    return res.status(200).json({
      message: "Nearby riders fetched successfully",
      riders: nearbyRiders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch nearby riders", error: error.message });
  }
};
