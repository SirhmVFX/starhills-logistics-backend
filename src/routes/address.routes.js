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
router.get("/:addressId", getAddressById);
router.post("/", createAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
