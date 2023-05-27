import { BadRequestException, Injectable, NotFoundException, Req } from '@nestjs/common'; 
import { Request } from 'express';
 import { PrismaService } from 'src/prisma/prisma.service'; 

 import { Allergy, Disease, Doctor, MedicalFile, Medication, PatientProfile,User, Vaccination } from '@prisma/client';
@Injectable() 
export class ProfileService { 
    constructor(private prisma: PrismaService){ } 
    async BasicP(id: number): Promise<PatientProfile>{
         const usr = await this.prisma.patientProfile.findUnique({
             where:{
                user_id: id
              } 
            }) ;
            
        

           return usr;
        } 


        async diseases (id: number): Promise<Disease[]>{
            const patient = await this.prisma.patientProfile.findUnique({
                where:{
                    user_id : id
                },
                include:{
                    diseases: true,
                }
            });

            return patient.diseases;
        }
        async allergies (id: number): Promise<Allergy[]>{
            const patient = await this.prisma.patientProfile.findFirst({
                where:{
                    user_id : id
                },
                include:{
                    allergies: true,
                }
            });

            return patient.allergies;
        }
        async vaccinations (id: number): Promise<Vaccination[]>{
            const patient = await this.prisma.patientProfile.findUnique({
                where:{
                    user_id : id
                },
                include:{
                    vaccinations: true,
                }
            });

            return patient.vaccinations;
        }

        async Doc(id: number): Promise<Doctor[]>{
            const patient = await this.prisma.patientProfile.findUnique({
                where:{
                    user_id : id
                },
                include:{
                    doctors: true,
                }
            });

            return patient.doctors; 
        }

       
        async allergie(email: string) : Promise<Allergy[]>{
            console.log(email)
            const patient = await this.prisma.patientProfile.findFirst({
                where:{
                    email: email
                },
                include:{
                    allergies: true,
                }
            });

            return patient.allergies;
        }

        async Doc2(email: string): Promise<Doctor[]>{
            console.log(email)
            const patient = await this.prisma.patientProfile.findFirst({
                where:{
                    email:email
                },
                include:{
                    doctors: true,
                }
            });

            return patient.doctors; 
        }

        async medications (id: number): Promise<Medication[]>{
            const patient = await this.prisma.patientProfile.findUnique({
                where:{
                    user_id : id
                },
                include:{
                    medications: true,
                }
            });

            return patient.medications;
        }

        async medication (email: string): Promise<Medication[]>{
            const patient = await this.prisma.patientProfile.findFirst({
                where:{
                    email: email
                },
                include:{
                    medications: true,
                }
            });

            return patient.medications;
        }

        async BasicP2(email: string): Promise<PatientProfile>{ 
            console.log(email)
            const usr = await this.prisma.patientProfile.findFirst({
                where:{
                   email: email
                 } 
               }) ;
               console.log(usr)
           
   
              return usr;
        }
        
       
        async getMedicalFilesForPatientAndSpecialty(patientId: number, specialtyName: string): Promise<MedicalFile[]> {
            const medicalFiles = await this.prisma.medicalFile.findMany({
              where: {
                AND: [
                  { patientId: patientId },
                  { specialtyName: specialtyName },
                ],
              },
            });
            console.log(medicalFiles)
            return medicalFiles;
          }
          
    }