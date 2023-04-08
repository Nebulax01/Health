/*
  Warnings:

  - You are about to drop the column `full_name` on the `PatientProfile` table. All the data in the column will be lost.
  - Added the required column `lastname` to the `PatientProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PatientProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "full_name",
ADD COLUMN     "lastname" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
