/*
  Warnings:

  - You are about to drop the column `Usimage` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[image]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_Usimage_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Usimage",
ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_image_key" ON "User"("image");
