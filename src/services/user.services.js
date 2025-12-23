import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

import crypto from "crypto";

// // Generate a secure encryption key (32 bytes for AES-256)
// const ENCRYPTION_KEY =
//   process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
// // Generate a secure IV (16 bytes for AES-256-CBC)
// const IV_LENGTH = 16;

// const encryptData = (data) => {
//   try {
//     // Generate a random IV for each encryption
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv(
//       "aes-256-cbc",
//       Buffer.from(ENCRYPTION_KEY, "hex"),
//       iv
//     );

//     // Encrypt the data
//     let encrypted = cipher.update(data, "utf8", "hex");
//     encrypted += cipher.final("hex");

//     // Return the IV and encrypted data as a single string (IV:encryptedData)
//     return `${iv.toString("hex")}:${encrypted}`;
//   } catch (error) {
//     console.error("Encryption error:", error);
//     throw new Error("Failed to encrypt data");
//   }
// };

// const decryptData = (encryptedData) => {
//   try {
//     // Split the IV and encrypted data
//     const [ivHex, encryptedText] = encryptedData.split(":");
//     if (!ivHex || !encryptedText) {
//       throw new Error("Invalid encrypted data format");
//     }

//     const iv = Buffer.from(ivHex, "hex");
//     const encryptedTextBuffer = Buffer.from(encryptedText, "hex");

//     const decipher = crypto.createDecipheriv(
//       "aes-256-cbc",
//       Buffer.from(ENCRYPTION_KEY, "hex"),
//       iv
//     );

//     // Decrypt the data
//     let decrypted = decipher.update(encryptedTextBuffer, "hex", "utf8");
//     decrypted += decipher.final("utf8");

//     return decrypted;
//   } catch (error) {
//     console.error("Decryption error:", error);
//     throw new Error("Failed to decrypt data");
//   }
// };

export const getUserService = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true, wallet: true, bankAccount: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

export const updateUserService = async (userId, data) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        profile: data.profile
          ? {
              upsert: {
                create: { ...data.profile },
                update: { ...data.profile },
              },
            }
          : undefined,
      },
      include: {
        profile: true,
      },
    });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const chnagePasswordService = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true },
    });

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

export const deleteAccountService = async (req, res) => {
  try {
    await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isActive: true, deletedAt: true },
    });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

// export const getShipbubbleKeyService = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user.id },
//       select: { shipbubbleApiKey: true },
//     });

//     if (!user.shipbubbleApiKey) {
//       return res.status(404).json({
//         success: false,
//         message: "Shipbubble API key not found",
//       });
//     }

//     const decryptedKey = decryptData(user.shipbubbleApiKey);
//     const maskedKey = `${decryptedKey.substring(0, 6)}****${decryptedKey.substring(decryptedKey.length - 4)}`;

//     res.json({
//       success: true,
//       apiKey: maskedKey,
//       hasKey: true,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch API key",
//       error: error.message,
//     });
//   }
// };

// export const saveShipbubbleKeyService = async (req, res) => {
//   try {
//     const { apiKey } = req.body;

//     // Validate API key by testing it
//     const testResult = await shipbubbleRequest(
//       "/wallet/balance",
//       "GET",
//       null,
//       apiKey
//     );

//     if (!testResult.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Shipbubble API key",
//       });
//     }

//     // Encrypt and save
//     const encryptedKey = encryptData(apiKey);
//     await prisma.user.update({
//       where: { id: userId },
//       data: { shipbubbleApiKey: encryptedKey },
//     });

//     res.json({
//       success: true,
//       message: "Shipbubble API key saved successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to save API key",
//       error: error.message,
//     });
//   }
// };
