-- CreateTable
CREATE TABLE "MedicalFile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "specialtyId" INTEGER NOT NULL,

    CONSTRAINT "MedicalFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalFile" ADD CONSTRAINT "MedicalFile_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
