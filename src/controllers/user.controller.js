import { upload } from "../services/file.services.js";
import {
  deleteAccountService,
  getUserService,
  updateUserService,
} from "../services/user.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getUser = async (req, res) => {
  try {
    await getUserService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const updateUser = async (req, res) => {
  try {
    await updateUserService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const changePassword = async (req, res) => {
  try {
    await updateUserService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await deleteAccountService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

// export const getShipbubbleKey = async (req, res) => {
//   const result = await getShipbubbleKeyService(req.user.id);
//   return res.status(result.status || 200).json(result);
// };

// export const saveShipbubbleKey = async (req, res) => {
//   const { apiKey } = req.body;
//   if (!apiKey) {
//     return res.status(400).json({
//       success: false,
//       message: "API key is required",
//     });
//   }
//   const result = await saveShipbubbleKeyService(req.user.id, apiKey);
//   return res.status(result.status || 200).json(result);
// };
