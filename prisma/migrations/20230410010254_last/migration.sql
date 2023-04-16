-- AlterTable
CREATE SEQUENCE doctorid_id_seq;
ALTER TABLE "DoctorId" ALTER COLUMN "id" SET DEFAULT nextval('doctorid_id_seq');
ALTER SEQUENCE doctorid_id_seq OWNED BY "DoctorId"."id";
