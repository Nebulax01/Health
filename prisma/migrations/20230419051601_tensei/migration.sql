/*
  Warnings:

  - You are about to drop the column `fullName` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "fullName",
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "name" TEXT;
