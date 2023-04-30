/*
  Warnings:

  - You are about to drop the column `patientId` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the column `specialtyName` on the `MedicalFile` table. All the data in the column will be lost.
  - Added the required column `patient_id` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MedicalFile" DROP CONSTRAINT "MedicalFile_patientId_fkey";

-- DropIndex
DROP INDEX "MedicalFile_patientId_key";

-- AlterTable
ALTER TABLE "MedicalFile" DROP COLUMN "patientId",
DROP COLUMN "specialtyName",
ADD COLUMN     "patient_id" INTEGER NOT NULL,
ADD COLUMN     "specialty" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MedicalFile" ADD CONSTRAINT "MedicalFile_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
