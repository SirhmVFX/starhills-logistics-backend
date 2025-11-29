import express from "express";
import {
  bankVerify,
  getUser,
  updateUser,
  uploadId,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", getUser);
router.post("/me/bank-verify", bankVerify);
router.put("/me/update", updateUser);
router.post("/me/upload-id", uploadId);
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

export default router;
