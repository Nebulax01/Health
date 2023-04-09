/*
  Warnings:

  - Added the required column `address` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'DOCTOR', 'MEDICAL_STAFF');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Role" "UserRole" NOT NULL DEFAULT 'PATIENT';

-- CreateTable
CREATE TABLE "_DoctorPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorPatient_AB_unique" ON "_DoctorPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorPatient_B_index" ON "_DoctorPatient"("B");

-- AddForeignKey
ALTER TABLE "_DoctorPatient" ADD CONSTRAINT "_DoctorPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("doctor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorPatient" ADD CONSTRAINT "_DoctorPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "PatientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
