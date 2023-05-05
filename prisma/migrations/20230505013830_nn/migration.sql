/*
  Warnings:

  - Made the column `date` on table `Vaccination` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "date" SET NOT NULL;
