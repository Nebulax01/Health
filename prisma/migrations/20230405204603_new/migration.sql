/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalStaffId" (
    "id" INTEGER NOT NULL,
    "used_by" TEXT NOT NULL,

    CONSTRAINT "MedicalStaffId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorId" (
    "id" INTEGER NOT NULL,
    "used_by" TEXT NOT NULL,

    CONSTRAINT "DoctorId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalStaff" (
    "medical_staff_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "MedicalStaff_pkey" PRIMARY KEY ("medical_staff_id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "doctor_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_refresh_token_key" ON "User"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "User_access_token_key" ON "User"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaffId_used_by_key" ON "MedicalStaffId"("used_by");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorId_used_by_key" ON "DoctorId"("used_by");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_user_id_key" ON "MedicalStaff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_user_id_key" ON "Doctor"("user_id");

-- AddForeignKey
ALTER TABLE "MedicalStaff" ADD CONSTRAINT "MedicalStaff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalStaff" ADD CONSTRAINT "MedicalStaff_medical_staff_id_fkey" FOREIGN KEY ("medical_staff_id") REFERENCES "MedicalStaffId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "DoctorId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
