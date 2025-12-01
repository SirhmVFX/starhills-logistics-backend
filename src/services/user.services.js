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

    return user;
  } catch (error) {}
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
    return user;
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

export const updateProfilePictureService = async (userId, file) => {
  try {
    const fileUrl = `/uploads/profiles/${file.filename}`;

    // Update user's profile with the new picture URL
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            create: { profilePicture: fileUrl },
            update: { profilePicture: fileUrl },
          },
        },
      },
      include: { profile: true },
    });

    // Delete old profile picture if it exists
    if (user.profile?.profilePicture) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        user.profile.profilePicture
      );
      await deleteFile(oldFilePath);
    }

    return user;
  } catch (error) {
    // Delete the uploaded file if there was an error
    if (file?.path) {
      await deleteFile(file.path);
    }
    throw error;
  }
};
