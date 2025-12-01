// src/services/promotion.service.js
import prisma from "../prismaClient.js";
import { v4 as uuidv4 } from "uuid";

export const createPromotionService = async (data) => {
  try {
    const promotion = await prisma.promotion.create({
      data: {
        id: uuidv4(),
        title: data.title,
        code: data.code.toUpperCase(),
        discount: data.discount,
        expiryDate: new Date(data.expiryDate),
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return promotion;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Promotion code already exists");
    }
    throw new Error(`Failed to create promotion: ${error.message}`);
  }
};

export const getPromotionByCodeService = async (code) => {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    if (new Date() > new Date(promotion.expiryDate)) {
      throw new Error("Promotion code has expired");
    }

    if (!promotion.isActive) {
      throw new Error("Promotion code is not active");
    }

    return promotion;
  } catch (error) {
    throw new Error(`Failed to get promotion: ${error.message}`);
  }
};

export const getAllPromotionsService = async () => {
  try {
    return await prisma.promotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    throw new Error(`Failed to get promotions: ${error.message}`);
  }
};

export const updatePromotionService = async (id, data) => {
  try {
    const updateData = { ...data };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    if (updateData.expiryDate) {
      updateData.expiryDate = new Date(updateData.expiryDate);
    }

    return await prisma.promotion.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Promotion code already exists");
    }
    throw new Error(`Failed to update promotion: ${error.message}`);
  }
};

export const deletePromotionService = async (id) => {
  try {
    return await prisma.promotion.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Failed to delete promotion: ${error.message}`);
  }
};
