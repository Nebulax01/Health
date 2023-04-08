/*
  Warnings:

  - You are about to drop the column `user_id` on the `MedicalStaff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refresh_token]` on the table `MedicalStaff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `MedicalStaff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MedicalStaff" DROP CONSTRAINT "MedicalStaff_user_id_fkey";

-- DropIndex
DROP INDEX "MedicalStaff_user_id_key";

-- AlterTable
ALTER TABLE "MedicalStaff" DROP COLUMN "user_id",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "refresh_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_refresh_token_key" ON "MedicalStaff"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaff_access_token_key" ON "MedicalStaff"("access_token");
