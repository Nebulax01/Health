/*
  Warnings:

  - Changed the type of `phone_number` on the `PatientProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "phone_number",
ADD COLUMN     "phone_number" INTEGER NOT NULL;
