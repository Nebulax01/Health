/*
  Warnings:

  - You are about to drop the column `name` on the `MedicalFile` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `MedicalFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalFile" DROP COLUMN "name",
DROP COLUMN "url";
