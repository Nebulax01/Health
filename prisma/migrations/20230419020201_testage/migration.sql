/*
  Warnings:

  - You are about to drop the column `specialtyId` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the `PatientSpecialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `MedicalFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialtyName` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicalFile" DROP CONSTRAINT "MedicalFile_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "PatientSpecialty" DROP CONSTRAINT "PatientSpecialty_patientId_fkey";

-- DropForeignKey
ALTER TABLE "PatientSpecialty" DROP CONSTRAINT "PatientSpecialty_specialtyId_fkey";

-- AlterTable
ALTER TABLE "MedicalFile" DROP COLUMN "specialtyId",
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD COLUMN     "specialtyName" TEXT NOT NULL;

-- DropTable
DROP TABLE "PatientSpecialty";

-- DropTable
DROP TABLE "Specialty";

-- CreateIndex
CREATE UNIQUE INDEX "MedicalFile_patientId_key" ON "MedicalFile"("patientId");

-- AddForeignKey
ALTER TABLE "MedicalFile" ADD CONSTRAINT "MedicalFile_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
