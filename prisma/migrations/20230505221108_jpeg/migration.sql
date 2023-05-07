/*
  Warnings:

  - The `photo` column on the `PatientProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "photo",
ADD COLUMN     "photo" BYTEA;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA;

-- CreateIndex
CREATE UNIQUE INDEX "User_image_key" ON "User"("image");
