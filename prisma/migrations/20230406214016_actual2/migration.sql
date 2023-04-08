/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `MedicalStaffId` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `MedicalStaffId` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MedicalStaffId" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaffId_refresh_token_key" ON "MedicalStaffId"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaffId_access_token_key" ON "MedicalStaffId"("access_token");
