-- AlterTable
CREATE SEQUENCE doctorid_idx_seq;
ALTER TABLE "DoctorId" ALTER COLUMN "idx" SET DEFAULT nextval('doctorid_idx_seq');
ALTER SEQUENCE doctorid_idx_seq OWNED BY "DoctorId"."idx";

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "DoctorId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
