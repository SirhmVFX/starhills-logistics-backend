-- DropIndex
DROP INDEX "Shipment_userId_status_idx";

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "dateCreated" TIMESTAMP(3),
ADD COLUMN     "receiverCoordinates" TEXT,
ADD COLUMN     "senderCoordinates" TEXT;

-- CreateIndex
CREATE INDEX "Shipment_userId_idx" ON "Shipment"("userId");

-- CreateIndex
CREATE INDEX "Shipment_status_idx" ON "Shipment"("status");

-- CreateIndex
CREATE INDEX "Shipment_shipbubbleId_idx" ON "Shipment"("shipbubbleId");

-- CreateIndex
CREATE INDEX "Shipment_createdAt_idx" ON "Shipment"("createdAt");
