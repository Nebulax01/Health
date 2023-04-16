/*
  Warnings:

  - The primary key for the `DoctorId` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `DoctorId` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idx` to the `DoctorId` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "DoctorId" DROP CONSTRAINT "DoctorId_pkey" CASCADE,
ADD COLUMN     "idx" INTEGER NOT NULL,
ADD CONSTRAINT "DoctorId_pkey" PRIMARY KEY ("idx");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorId_id_key" ON "DoctorId"("id");
