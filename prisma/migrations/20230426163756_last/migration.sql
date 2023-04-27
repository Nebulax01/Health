/*
  Warnings:

  - Changed the type of `emergency_contact` on the `PatientProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "emergency_contact",
ADD COLUMN     "emergency_contact" INTEGER NOT NULL;
