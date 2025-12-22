import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  updateAddress,
  validateAddress,
} from "../controllers/address.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/validate", authMiddleware, validateAddress);
router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, createAddress);
router.get("/:addressId", authMiddleware, getAddressById);
router.put("/:addressId", authMiddleware, updateAddress);
router.delete("/:addressId", authMiddleware, deleteAddress);

export default router;
