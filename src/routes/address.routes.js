import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  updateAddress,
  validateAddress,
} from "../controllers/address.controller.js";
const router = express.Router();

router.post("/validate", validateAddress);
router.get("/", getAddresses);
router.post("/", createAddress);
router.get("/:addressId", getAddressById);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
