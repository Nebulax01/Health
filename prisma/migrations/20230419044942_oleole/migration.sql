-- DropForeignKey
ALTER TABLE "Allergy" DROP CONSTRAINT "Allergy_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Disease" DROP CONSTRAINT "Disease_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_patient_id_fkey";

-- AddForeignKey
ALTER TABLE "Disease" ADD CONSTRAINT "Disease_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "PatientProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
