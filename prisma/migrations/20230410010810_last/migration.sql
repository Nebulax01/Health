/*
  Warnings:

  - The primary key for the `DoctorId` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DoctorId` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX IF EXISTS DoctorId_used_by_key CASCADE;



-- AlterTable
ALTER TABLE "DoctorId" DROP CONSTRAINT "DoctorId_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DoctorId_pkey" PRIMARY KEY ("used_by");


