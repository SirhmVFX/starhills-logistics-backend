import prisma from "../prismaClient.js";

export const createRideService = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.body;
    const ride = await prisma.ride.create({
      data: {
        passengerId: req.user.id,
        originLat,
        originLng,
        destLat,
        destLng,
        status: "PENDING",
        price: 0,
      },
    });
    return res.status(200).json({ message: "Ride created successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create ride", error });
  }
};

export const getRideService = async (req, res) => {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: req.params.id },
      include: { passenger: true, rider: true },
    });
    return res.status(200).json({ message: "Ride fetched successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ride", error });
  }
};

export const cancelRideService = async (req, res) => {
  try {
    const ride = await prisma.ride.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });
    return res
      .status(200)
      .json({ message: "Ride cancelled successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel ride", error });
  }
};

export const acceptRideService = async (req, res) => {
  try {
    const ride = await prisma.ride.update({
      where: { id: req.params.id },
      data: { status: "ACCEPTED" },
    });
    return res
      .status(200)
      .json({ message: "Ride accepted successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to accept ride", error });
  }
};

export const trackRideService = async (req, res) => {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: req.params.id },
      include: { rider: { include: { riderLocation: true } } },
    });
    return res.status(200).json({ message: "Ride fetched successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch ride", error });
  }
};

export const rateRideService = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const ride = await prisma.ride.findUnique({ where: { id: req.params.id } });
    if (!ride.riderId) throw new Error("Ride has no assigned rider yet");

    const rating = await prisma.rating.create({
      data: {
        userId: req.user.id,
        riderId: ride.riderId,
        score,
        comment,
      },
    });
    return res.status(200).json({ message: "Ride rated successfully", ride });
  } catch (error) {
    return res.status(500).json({ message: "Failed to rate ride", error });
  }
};
