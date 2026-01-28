import prisma from "../prismaClient.js";

import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils.js";
import { sendOtpEmail, sendWelcomeEmail } from "../sendgrid/email.js";
import { token } from "morgan";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost",
};

export const registerService = async (req, res) => {
  try {
    const { email, phone, password, fullName, businessName, address } =
      req.body;

    // Validate input fields
    if (!fullName) {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const phoneRegex = /^(?:\+?234|0)?[789][01]\d{8}$/;
    // Add leading zero if missing
    let formattedPhone = phone;
    if (phone.startsWith("234")) {
      formattedPhone = "0" + phone.substring(3);
    } else if (phone.startsWith("+234")) {
      formattedPhone = "0" + phone.substring(4);
    } else if (!phone.startsWith("0")) {
      formattedPhone = "0" + phone;
    }
    if (!phoneRegex.test(formattedPhone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number" });
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: {
        phone: formattedPhone,
      },
    });
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await prisma.otp.deleteMany({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    // Create new OTP record in the database
    await prisma.otp.create({
      data: {
        phone: formattedPhone,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        password,
        fullName,
        email,
      },
    });

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        phone: formattedPhone,
        password: await bcrypt.hash(password, 10), // hash password
        fullName,
        role: "CUSTOMER",
      },
    });

    // Create wallet for the user
    await prisma.wallet.create({
      data: {
        userId: newUser.id,
        balance: 0,
      },
    });

    // Send OTP to the user's phone
    const otpSent = await sendOtpEmail(newUser.email, newUser.fullName, otp);
    if (!otpSent) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    // Generate access token and refresh token
    const accessToken = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);

    // Optionally, store refresh token in the user's record
    await prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken },
    });

    // Send the welcome email to the user
    await sendWelcomeEmail(newUser.email, newUser.fullName);

    // Return success response with user data and tokens
    return res.status(201).json({
      success: true,
      message:
        "User created successfully and OTP sent to your phone. Please verify to complete registration.",
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Registration Failed",
      error: error?.message || "Unknown error",
    });
  }
};

export const resendOtpService = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email number is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found for this email" });
    }

    await prisma.otp.deleteMany({ where: { email } });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.create({
      data: {
        email: email,
        otp: newOtp,
        expiresAt: expiresAt,
        fullName: user.fullName,
        phone: user.phone,
        password: user.password,
      },
    });

    const sent = await sendOtpEmail(user.email, user.fullName, newOtp);
    if (!sent) {
      return res.status(500).json({ message: "Failed to resend OTP to email" });
    }

    return res.status(200).json({
      message: "OTP resent successfully. Check your email.",
      user,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      message: "Failed to resend OTP to email",
      error: error?.message || "Unknown error",
    });
  }
};

export const verifyOtpService = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is required" });
    }

    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this email number",
      });
    }

    const otpEntry = await prisma.otp.findFirst({
      where: { email, otp: otp.toString() },
    });

    if (!otpEntry) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (otpEntry.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    // Generate new tokens
    const accessToken = signAccessToken(updatedUser);
    const refreshToken = signRefreshToken(updatedUser);

    // Update refresh token in the database
    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });

    // Clean up the used OTP
    await prisma.otp.delete({ where: { id: otpEntry.id } });

    // Set cookies
    res.cookie(ACCESS_COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        isEmailVerified: updatedUser.isEmailVerified,
        role: updatedUser.role,
      },
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

export const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const accessToken = signAccessToken({ id: user.id, email: user.email });
    const refreshToken = signRefreshToken({ id: user.id, email: user.email });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie(ACCESS_COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

export const refreshTokenService = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token found" });
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "No user found with this id" });
    }

    if (!user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Session revoked" });
    }

    if (user.refreshToken !== token) {
      return res
        .status(401)
        .json({ success: false, message: "Session revoked" });
    }
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
      email: user.email,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie(ACCESS_COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Refresh token successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutService = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "No user found with this id" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    res.clearCookie(ACCESS_COOKIE_NAME);
    res.clearCookie(REFRESH_COOKIE_NAME);

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPasswordService = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone: user.phone,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        fullName: user.fullName,
        email: user.email,
      },
    });

    await sendPasswordResetEmail(user.email, user.fullName, otp);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verfifyPasswordResetOtpService = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const otpEntry = await prisma.otp.findFirst({ where: { email, otp } });

    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpEntry.expiresAt < new Date()) {
      // delete expired entry
      await prisma.otp.delete({ where: { id: otpEntry.id } });
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    await prisma.otp.delete({ where: { id: otpEntry.id } });

    return res
      .status(200)
      .json({ message: "Password Otp verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordService = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    if (!confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Confirm password is required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePasswordService = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!oldPassword) {
      return res.status(400).json({ message: "Old password is required" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    if (!confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "Confirm new password is required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const devResetUserService = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email number is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No user found to delete" });
    }

    await prisma.wallet.deleteMany({
      where: { userId: user.id },
    });

    await prisma.delivery.deleteMany({
      where: { senderId: user.id },
    });
    await prisma.walletTransaction
      ?.deleteMany({
        where: { userId: user.id },
      })
      .catch(() => {});

    await prisma.otp.deleteMany({ where: { email } });

    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(200).json({
      message: "data cleared successfully (user, wallet, OTP removed).",
    });
  } catch (error) {
    console.error("Developer Reset Error:", error);
    return res.status(500).json({
      message: "Failed to reset user test data",
      error: error.message,
    });
  }
};
