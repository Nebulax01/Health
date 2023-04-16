/*
  Warnings:

  - The primary key for the `DoctorId` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `used_by` on the `DoctorId` table. All the data in the column will be lost.
  - Added the required column `id` to the `DoctorId` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_doctor_id_fkey";

-- DropIndex
DROP INDEX "DoctorId_used_by_key";

-- AlterTable
ALTER TABLE "DoctorId" DROP CONSTRAINT "DoctorId_pkey",
DROP COLUMN "used_by",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "DoctorId_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "DoctorId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
