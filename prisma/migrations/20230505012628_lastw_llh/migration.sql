/*
  Warnings:

  - Made the column `date` on table `MedicalFile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MedicalFile" ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Medication" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
