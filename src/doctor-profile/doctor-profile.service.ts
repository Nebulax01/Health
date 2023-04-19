import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Doctor, MedicalFile, PatientProfile } from '@prisma/client';
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
    async deletePatient(doctorId:number, patientId: number){
      const Doc = await this.prisma.doctor.findFirst({
        where:{
            user_id : doctorId
        },
        include: {patients: true}
    });
console.log(Doc)

    const foundIndex = Doc.patients.findIndex((obj) => obj.user_id === patientId);

if (foundIndex !== -1) {
  
  await this.prisma.doctor.update({
    where: {
      user_id: doctorId
    },
    data: {
      patients: {
        disconnect: {
          user_id: patientId
        }
      }
    },
    include: {
      patients: true
    }
  });
  await this.prisma.patientProfile.update({
    where: {
      user_id: patientId
    },
    data: {
      doctors: {
        disconnect: {
          user_id: doctorId
        }
      }
    },
    include: {
      doctors: true
    }
  });
}
else {
  throw new NotFoundException("patient not found ")
}

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
      



  
  async addPatient(doctorId: number, email: string):Promise<void>{
    console.log(email)
    console.log(doctorId)
    const patient = await this.prisma.patientProfile.findFirst({
      where: { email: email }});

    
    if(!patient)  throw new ForbiddenException(`Patient does not exist`);
   
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
async getMedicalFiles(doctorId: number, patientId: number, specialtyName: string): Promise<MedicalFile[]>{

  const Doc = await this.prisma.doctor.findUnique({
    where:{
      user_id: doctorId
    }
  });

  if(Doc.specialty !== specialtyName){
    throw new UnauthorizedException('you are not allowed to view this information');
  }
  const medicalFiles = await this.prisma.medicalFile.findMany({
    where: {
      patientId: patientId,
      specialtyName: specialtyName
    },
  });
  return medicalFiles;

}

async addMedicalFiles(doctorId: number, patientId: number, specialtyName: string, url: string){
  
  const Doc = await this.prisma.doctor.findUnique({
    where:{
      user_id: doctorId
    }
  });

  if(Doc.specialty !== specialtyName){
    throw new UnauthorizedException('you are not allowed to view this information');
  }
}
    

}
