/*
  Warnings:

  - You are about to drop the column `photo` on the `PatientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "photo";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DATA TYPE TEXT;
