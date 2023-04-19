import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorProfileService } from './doctor-profile.service';
import { Allergy, ChatRoom, Disease, Doctor, MedicalFile, Medication, Message, PatientProfile } from '@prisma/client';


import { Request } from 'express';

import { ChatService } from 'src/chat/chat.service';
import { DocPatDTO } from 'src/chat/dto';
import { ProfileService } from 'src/profile/profile.service';



@Controller('doctorP')
export class DoctorProfileController {
    constructor (private DocPserv: DoctorProfileService, private chat: ChatService, private ProfileS: ProfileService){}


    @Post('/:id/basic-info')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getDocBinfo(@Param('id', ParseIntPipe)doctorId: number): Promise<Doctor>{
      
        return await this.DocPserv.getDocBinfo(doctorId);
    }

    @Post('/:id/patients')
    
    async getPatients(@Param('id', ParseIntPipe)doctorId: number){
      return await this.DocPserv.getDocPatients(doctorId)
    }
    //what in the fuck
    @Post('patientProfile/:id')
 
    
  
    async getPatientP(@Param('id', ParseIntPipe) patientId: number): Promise<PatientProfile>{

      return this.DocPserv.getPatient(patientId);
        
    }

    @Get('/:id/addPatient')

    
    async addPatient(@Param('id',ParseIntPipe)doctorId: number,@Req() req: Request):Promise<void>{
    
     // console.log(req.user['sub']);
      await this.DocPserv.addPatient(doctorId, req.body['email']);
  }
    @Post('/deletePatient')
    async deletePatient(@Body() docpat: DocPatDTO){
        console.log(docpat.docId)
        console.log(docpat.patId)
        await this.DocPserv.deletePatient(docpat.docId, docpat.patId)
    }

  @Post('chatRooms')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getChatRoomsForDoctor(@Req() req: Request): Promise<ChatRoom[]>{
        return await this.chat.getChatRoomsForDoctor(req.user['sub']);
        
    }
    @Post('chatRooms/:patientId')
    @HttpCode(HttpStatus.OK)
    
    async getMessagesForChatRoom(@Body() docpat: DocPatDTO): Promise<Message[]>{
        return await this.chat.getMessagesForChatRoom(docpat);
        
    }

    @Post('patients')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async  getDocPatients(@Req() req: Request): Promise<PatientProfile[]>{
       return await this.DocPserv. getDocPatients(req.user['sub']);
        
    }

    @Post('patients/:id/basic-info') 
    
     async Basic_info(@Param('id', ParseIntPipe) patientId: number): Promise<PatientProfile>{ 
          return await this.ProfileS.BasicP(patientId); 
      } 
  
      @Post('patients/:id/diseases')
      @HttpCode(HttpStatus.OK)
    
      async diseases(@Param('id', ParseIntPipe) patientId: number) : Promise<Disease[]>{
          return await this.ProfileS.diseases(patientId);
      }
      @Post('patients/:id/allergies')
      @HttpCode(HttpStatus.OK)
     
      async allergies(@Param('id', ParseIntPipe) patientId: number) : Promise<Allergy[]>{
          return await this.ProfileS.allergies(patientId);
      }
  
   
  
      @Post('patients/:id/medications')
      @HttpCode(HttpStatus.OK)
    
      async medications (@Param('id', ParseIntPipe) patientId: number): Promise<Medication[]>{
          return await this.ProfileS.medications(patientId);
      }


      @Get('patients/:id/MedicalFiles/:name')
      @HttpCode(HttpStatus.OK)
      @UseGuards(AuthGuard('jwt'))
      async getMedicalFiles(@Req() req: Request, @Param('id', ParseIntPipe) patientId: number, @Param('name') specialtyName: string): Promise<MedicalFile[]>{
        return await this.DocPserv.getMedicalFiles(req.user['sub'], patientId, specialtyName)

      }

    //   @Post('patients/:id/specialties/:specialty')
    //   @HttpCode(HttpStatus.OK)
    
    //   async specialty (@Param('id', ParseIntPipe) patientId: number, @Param('specialty') specialty: string): Promise<Medication[]>{
    //       return await this.ProfileS.specialty(patientId, specialty);
    //   }
    
}
