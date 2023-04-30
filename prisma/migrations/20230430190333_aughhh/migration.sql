/*
  Warnings:

  - You are about to drop the column `date` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `MedicalFile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `MedicalFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialtyName` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicalFile" DROP CONSTRAINT "MedicalFile_patient_id_fkey";

-- AlterTable
ALTER TABLE "MedicalFile" DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "patient_id",
DROP COLUMN "specialty",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD COLUMN     "specialtyName" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalFile_patientId_key" ON "MedicalFile"("patientId");

-- AddForeignKey
ALTER TABLE "MedicalFile" ADD CONSTRAINT "MedicalFile_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
