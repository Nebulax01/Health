/*
  Warnings:

  - You are about to drop the column `url` on the `MedicalFile` table. All the data in the column will be lost.
  - Added the required column `description` to the `MedicalFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalFile" DROP COLUMN "url",
ADD COLUMN     "description" TEXT NOT NULL;
