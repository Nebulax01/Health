/*
  Warnings:

  - Added the required column `url` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalFile" ADD COLUMN     "url" TEXT NOT NULL;
