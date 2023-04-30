/*
  Warnings:

  - Added the required column `specialtyName` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalFile" ADD COLUMN     "specialtyName" TEXT NOT NULL;
