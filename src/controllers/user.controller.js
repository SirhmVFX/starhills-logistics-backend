import {
  bankVerifyService,
  getUserService,
  updateUserService,
  uploadIdService,
} from "../services/user.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserService(userId);
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const user = await updateUserService(userId, data);
    handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const uploadId = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const user = await uploadIdService(userId, data);
    handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const bankVerify = async (req, res) => {
  try {
    const userId = req.params.id;
    const { bankName, accountNumber, accountName, bvn } = req.body;
    const user = await bankVerifyService(userId, {
      bankName,
      accountNumber,
      accountName,
      bvn,
    });
    handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
