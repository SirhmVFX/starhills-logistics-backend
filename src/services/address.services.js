import prisma from "../prismaClient.js";

import { makeShipbubbleRequest } from "./shipbubble.service.js";
export const validateAddressService = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const result = await makeShipbubbleRequest(
      "/shipping/address/validate",
      "POST",
      req.body
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      valid: result.data.valid,
      validatedAddress: result.data.validated_address,
      coordinates: result.data.coordinates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to validate address",
      error: error.message,
    });
  }
};

export const getAddressesService = async (req, res) => {
  try {
    const addresses = await prisma.address.findFirst({
      where: {
        userId: req.user.id,
        isDeleted: false,
      },
    });

    const result = await makeShipbubbleRequest("/shipping/address", "GET");

    res.json({
      success: true,
      addresses: result.data?.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

export const getAddressByIdService = async (req, res) => {
  try {
    const address = await prisma.address.findOne({
      _id: req.params.addressId,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

export const createAddressService = async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      userId: req.user.id,
    };

    const address = await prisma.address.create(addressData);

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

export const updateAddressService = async (req, res) => {
  try {
    const address = await prisma.address.findOneAndUpdate(
      { _id: req.params.addressId, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const deleteAddressService = async (req, res) => {
  try {
    const address = await prisma.address.findOneAndUpdate(
      { _id: req.params.addressId, userId: req.user.id },
      { isDeleted: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
