import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { Doctor, MedicalFile, Medication, PatientProfile } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MedicFDTO } from './dtos/medicalF.dto';
import { MedicaDTO, VaccDTO } from './dtos';
import { docDTO } from 'src/auth/dto/docDto.dto';
import { PatDTO } from './dtos/pat.dto';

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
async addmedications (patientId: number, dto: MedicaDTO): Promise<void>{
  
  await this.prisma.medication.create({
    data:{
      name: dto.name,
      disease: dto.disease,
      date: dto.date,
      patient_id: patientId
    }
  })


}
async editBasic( dto: docDTO,doctorId: number){
      await this.prisma.doctor.update({
        where:{
          user_id: doctorId
        },
        data: {
          name: dto.name,
          lastname: dto.lastname,
          
          phoneNumber: dto.phonenumber,
          
          
          
          
        }
      })
}
async editBasicPat( dto: PatDTO,patientId: number){
  await this.prisma.patientProfile.update({
    where:{
      user_id: patientId
    },
    data: {
      weight: dto.weight,
      height: dto.height,
      

      
      
      
      
    }
  })
}

async addallergy (patientId: number, name: string): Promise<void>{

  await this.prisma.allergy.create({
    data:{
      name: name,
     
    
      patient_id: patientId
    }
  })


}

async adddisease (patientId: number, name: string): Promise<void>{

  await this.prisma.disease.create({
    data:{
      name: name,
      patient_id: patientId
    }
  })


}

async addvaccination (patientId: number, dto: VaccDTO): Promise<void>{

  await this.prisma.vaccination.create({
    data:{
      name: dto.name,
     
      date: dto.date,
      patient_id: patientId
    }
  })


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

async addMedicalFiles(doctorId: number, patientId: number, dto: MedicFDTO){

  const Doc = await this.prisma.doctor.findUnique({
    where:{
      user_id: doctorId
    }
  });

  if(Doc.specialty !== dto.specialtyName){
    throw new UnauthorizedException('you are not allowed to update information');

  }
  await this.prisma.medicalFile.create({
   
     
  
    data:{
      patientId: patientId,
      specialtyName: dto.specialtyName,
      url: dto.url,
      name: dto.name
    }
  })
}
    

}
