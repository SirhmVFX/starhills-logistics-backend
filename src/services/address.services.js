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
        message: result,
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
    // First validate the address with Shipbubble
    const validationResult = await makeShipbubbleRequest(
      "/shipping/address/validate",
      "POST",
      {
        name: req.body.name || "Recipient",
        email: req.body.email || req.user.email,
        phone: req.body.phone,
        address: req.body.address,
      }
    );

    if (!validationResult.success || !validationResult.data?.valid) {
      return res.status(400).json({
        success: false,
        message: "Address validation failed",
        details: validationResult.data?.message || "Invalid address",
        validationErrors: validationResult.data?.errors,
      });
    }

    // Use the validated address data
    const validatedAddress = validationResult.data.validated_address;

    const addressData = {
      userId: req.user.id,
      name: validatedAddress.name || req.body.name,
      email: validatedAddress.email || req.body.email,
      phone: validatedAddress.phone || req.body.phone,
      address: validatedAddress.address || req.body.address,
      city: validatedAddress.city || req.body.city,
      state: validatedAddress.state || req.body.state,
      country: validatedAddress.country || req.body.country,
      postalCode: validatedAddress.postal_code || req.body.postalCode,
      isDefault: req.body.isDefault || false,
      addressCode: validatedAddress.address_code,
      addressData: validatedAddress, // Store the full validated address data
    };

    // Create the address in the database
    const address = await prisma.address.create({
      data: addressData,
    });

    // If this is set as default, update other addresses
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.id,
          id: { not: address.id },
        },
        data: { isDefault: false },
      });
    }

    res.status(201).json({
      success: true,
      message: "Address created and validated successfully",
      address: {
        ...address,
        coordinates: validatedAddress.coordinates,
      },
    });
  } catch (error) {
    console.error("Address creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

export const updateAddressService = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = { ...req.body };

    // If address fields are being updated, validate with Shipbubble first
    if (
      updateData.address ||
      updateData.city ||
      updateData.state ||
      updateData.country ||
      updateData.name ||
      updateData.email ||
      updateData.phone
    ) {
      const validationResult = await makeShipbubbleRequest(
        "/shipping/address/validate",
        "POST",
        {
          name: updateData.name || "Recipient",
          email: updateData.email || req.user.email,
          phone: updateData.phone,
          address: updateData.address,
          city: updateData.city,
          state: updateData.state,
          country: updateData.country,
        }
      );

      if (!validationResult.success || !validationResult.data?.valid) {
        return res.status(400).json({
          success: false,
          message: "Address validation failed",
          details: validationResult.data?.message || "Invalid address",
          validationErrors: validationResult.data?.errors,
        });
      }

      // Update with validated address data
      const validatedAddress = validationResult.data.validated_address;
      updateData.address = validatedAddress.address || updateData.address;
      updateData.city = validatedAddress.city || updateData.city;
      updateData.state = validatedAddress.state || updateData.state;
      updateData.country = validatedAddress.country || updateData.country;
      updateData.postalCode =
        validatedAddress.postal_code || updateData.postalCode;
      updateData.addressCode = validatedAddress.address_code;
      updateData.addressData = validatedAddress;
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update the address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });

    // If this address is set as default, update other addresses
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: req.user.id,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    res.json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
      error: error.message,
    });
  }
};

export const deleteAddressService = async (req, res) => {
  try {
    const { addressId } = req.params;

    // First check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: req.user.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or you don't have permission to delete it",
      });
    }

    // Check if this is the user's only address
    const addressCount = await prisma.address.count({
      where: {
        userId: req.user.id,
        isDeleted: false,
      },
    });

    if (addressCount <= 1) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete your only address. Please add another address first.",
      });
    }

    // Soft delete the address
    const deletedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        isDeleted: true,
        // If this was the default address, we need to set another one as default
        ...(existingAddress.isDefault ? { isDefault: false } : {}),
      },
    });

    // If we just deleted the default address, set the most recently used one as default
    if (existingAddress.isDefault) {
      const mostRecentAddress = await prisma.address.findFirst({
        where: {
          userId: req.user.id,
          id: { not: addressId },
          isDeleted: false,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (mostRecentAddress) {
        await prisma.address.update({
          where: { id: mostRecentAddress.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
