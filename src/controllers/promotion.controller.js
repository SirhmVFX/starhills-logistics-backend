import {
  createPromotionService,
  getPromotionByCodeService,
  getAllPromotionsService,
  updatePromotionService,
  deletePromotionService,
} from "../services/promotion.services.js";

export const createPromotion = async (req, res) => {
  try {
    const promotion = await createPromotionService(req.body);
    res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      data: promotion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPromotion = async (req, res) => {
  try {
    const { code } = req.params;
    const promotion = await getPromotionByCodeService(code);
    res.status(200).json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPromotions = async (req, res) => {
  try {
    const promotions = await getAllPromotionsService();
    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await updatePromotionService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Promotion updated successfully",
      data: promotion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    await deletePromotionService(id);
    res.status(200).json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
