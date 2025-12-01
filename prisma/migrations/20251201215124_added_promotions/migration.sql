/*
  Warnings:

  - You are about to drop the column `description` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `discountFlat` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercent` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `maxUses` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Promotion` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "description",
DROP COLUMN "discountFlat",
DROP COLUMN "discountPercent",
DROP COLUMN "endsAt",
DROP COLUMN "maxUses",
DROP COLUMN "startsAt",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
