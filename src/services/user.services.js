import prisma from "../prismaClient.js";

export const getUserService = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, wallet: true, bankAccount: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User fetched successfully", user: user });
  } catch (error) {}
};

export const updateUserService = async (userId, data) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: data,
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

export const uploadIdService = async (userId, data) => {
  //   try {
  //     // multer middleware stores files in req.files
  //     const { ninDocument, selfie } = req.files;
  //     const ninPath = await s3Service.uploadFile(ninDocument[0]);
  //     const selfiePath = await s3Service.uploadFile(selfie[0]);
  //     const profile = await prisma.profile.update({
  //       where: { userId: req.user.id },
  //       data: { ninDocument: ninPath, selfie: selfiePath },
  //     });
  //     sendResponse(res, profile);
  //   } catch (err) {
  //     next(err);
  //   }
};

export const bankVerifyService = async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, bvn } = req.body;

    const bankAccount = await prisma.bankAccount.upsert({
      where: { userId: req.user.id },
      update: { accountNumber, accountName, bankName, verified: true },
      create: {
        userId: req.user.id,
        accountNumber,
        accountName,
        bankName,
        bvn,
        verified: true,
      },
    });
    sendResponse(res, bankAccount);
  } catch (err) {
    next(err);
  }
};
