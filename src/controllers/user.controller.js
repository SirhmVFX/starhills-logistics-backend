import { upload } from "../services/file.services.js";
import {
  getUserService,
  updateProfilePictureService,
  updateUserService,
} from "../services/user.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const getUser = async (req, res) => {
  try {
    const user = await getUserService(req.user.id);
    handleResponse(res, 200, "User fetched successfully", user);
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

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return handleResponse(res, 400, "No file uploaded", null);
    }

    const user = await updateProfilePictureService(req.user.id, req.file);
    handleResponse(res, 200, "Profile picture updated successfully", user);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const uploadProfilePictureHandler = upload.single("profilePicture");
