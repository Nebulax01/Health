/*
  Warnings:

  - Added the required column `name` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalFile" ADD COLUMN     "name" TEXT NOT NULL;
