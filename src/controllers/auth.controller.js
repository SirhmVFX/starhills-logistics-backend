import {
  forgotPasswordService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
  resetPasswordService,
  updatePasswordService,
  verfifyPasswordResetOtpService,
  verifyOtpService,
} from "../services/auth.services.js";

const handleResponse = (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const register = async (req, res) => {
  try {
    await registerService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    await verifyOtpService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const login = async (req, res) => {
  try {
    await loginService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const logout = async (req, res) => {
  try {
    await logoutService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    await forgotPasswordService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const verifyPasswordOtp = async (req, res) => {
  try {
    await verfifyPasswordResetOtpService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const resetPassword = async (req, res) => {
  try {
    await resetPasswordService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const refreshToken = async (req, res) => {
  try {
    await refreshTokenService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};

export const updatePassword = async (req, res) => {
  try {
    await updatePasswordService(req, res);
  } catch (error) {
    handleResponse(res, 500, error.message, null);
  }
};
