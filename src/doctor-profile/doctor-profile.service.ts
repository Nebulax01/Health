import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Doctor, PatientProfile } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorProfileService {
    constructor(private prisma: PrismaService,private Auth: AuthService, private chat: ChatService){}


    async getDocBinfo(id : number): Promise<Doctor>{
      console.log(id);
        const Doc = await this.prisma.doctor.findFirst({
            where:{
                user_id : id
            }
        });

        return Doc;

    }


   async  getDocPatients(id: number): Promise<PatientProfile[]>{
        const Doc = await this.prisma.doctor.findFirst({
            where:{
                user_id : id
            },
            include:{
                patients: true,
            }
        });

        return Doc.patients;
    }



async getPatient(patientId: number): Promise<PatientProfile>{
  const patient = await this.prisma.patientProfile.findUnique({
    where:{
      user_id: patientId
    }
  });

  return patient;

}
      
async grantAccess(patientId: number, doctorId: number): Promise<void> {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { doctors: true }
    });
  
    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }
  
    const isAuthorized = patient.doctors.some(d => d.id === doctorId);
  
    if (!isAuthorized) {
      throw new UnauthorizedException(`Doctor is not authorized to access patient`);
    }
  }

  // async acessPprofile(doctorId: number, patientId: number){
  //   this.grantAccess(patientId, doctorId);
  //   const patient = await this.prisma.patientProfile.findUnique({
  //       where: { id: patientId },
        
  //     });
  //   const token = await this.Auth.getTokens(patientId, patient.email,'DOCTOR');


  //   return token;
  // }
  
  async addPatient(doctorId: number, email: string):Promise<void>{
    const patient = await this.prisma.patientProfile.findFirst({
      where: { email: email }});
     console.log(doctorId);
     console.log(patient)
    await  this.prisma.doctor.update({
      where: {user_id: doctorId },
      data: { patients: { connect: { user_id: patient.user_id} } },
      
    });
    await  this.prisma.patientProfile.update({
      where: { user_id: patient.user_id },
      data: { doctors: { connect: { user_id: doctorId} } },
     
    });
    await this.chat.createchatRoom(doctorId, patient.user_id);

}
async specialty (patientId: number,specialty: string): Promise<Medication[]>{
  return await this.ProfileS.specialty(patientId, specialty);
}
    

}
