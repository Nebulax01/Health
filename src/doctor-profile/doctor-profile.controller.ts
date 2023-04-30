import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorProfileService } from './doctor-profile.service';
import { Allergy, ChatRoom, Disease, Doctor, MedicalFile, Medication, Message, PatientProfile } from '@prisma/client';


import { Request } from 'express';

import { ChatService } from 'src/chat/chat.service';
import { DocPatDTO, MsgDTO } from 'src/chat/dto';
import { ProfileService } from 'src/profile/profile.service';
import { MedicFDTO } from './dtos/medicalF.dto';
import { MedicaDTO, VaccDTO } from './dtos';
import { docDTO } from 'src/auth/dto/docDto.dto';
import { PatDTO } from './dtos/pat.dto';



@Controller('doctorP')
export class DoctorProfileController {
    constructor (private DocPserv: DoctorProfileService, private chat: ChatService, private ProfileS: ProfileService){}

    //doctor bs( profile + chatroom): 
    @Get('/:id/basic-info')
    @HttpCode(HttpStatus.OK)
    
    async getDocBinfo(@Param('id', ParseIntPipe)doctorId: number): Promise<Doctor>{
        console.log("asleme")
        return await this.DocPserv.getDocBinfo(doctorId);
    }

    @Get('/:doctorId/patients')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async  getDocPatients(@Param('doctorId', ParseIntPipe)doctorId: number): Promise<PatientProfile[]>{
       return await this.DocPserv. getDocPatients(doctorId);
        
    }
  
    @Get('patientProfile/:id')
    @HttpCode(HttpStatus.OK)
    async getPatientP(@Param('id', ParseIntPipe) patientId: number): Promise<PatientProfile>{

      return this.DocPserv.getPatient(patientId);
        
    }

    @Post('/:doctorId/addPatient/:email')
    @HttpCode(HttpStatus.CREATED)
    async addPatient(@Param('doctorId', ParseIntPipe)doctorId: number, @Param('email') email: string):Promise<void>{
    
     // console.log(req.user['sub']);
      await this.DocPserv.addPatient(doctorId, email);
  }
    @Post('/:doctorId/deletePatient/:id')
    async deletePatient(@Param('doctorId', ParseIntPipe)doctorId: number, @Param('id', ParseIntPipe) patientId: number){
       
        await this.DocPserv.deletePatient(doctorId, patientId)
    }
    @Get('/:doctorId/chatRooms/:patientId')
    @HttpCode(HttpStatus.OK)
    
    async getMessagesForChatRoom(@Param('doctorId', ParseIntPipe)doctorId: number, @Param('patientId', ParseIntPipe) patientId: number): Promise<Message[]>{
        
        return await this.chat.getMessagesForChatRoom(doctorId, patientId);
        
    }

  @Get('/:doctorId/chatRooms')
    @HttpCode(HttpStatus.OK)
    
    async getChatRoomsForDoctor(@Param('doctorId', ParseIntPipe)doctorId: number): Promise<ChatRoom[]>{
        return await this.chat.getChatRoomsForDoctor(doctorId);
        
    }
    
    @Post('/:doctorId/chatRooms/:chatroomId/sendMsg/:patientId')
    @HttpCode(HttpStatus.OK)
    async createMessage(@Param('doctorId') senderId: string, @Param('chatroomId') chatroomId: string, @Body(ValidationPipe)dto: MsgDTO): Promise<Message>{
        return await this.chat.createMessage(senderId, chatroomId, dto)
    }
//editing own info :
    @Post(':id/basic-info/edit')
    @HttpCode(HttpStatus.OK)
        async editBasic(@Body(ValidationPipe) dto: docDTO, @Param('id') doctorId: number){
            await this.DocPserv.editBasic(dto, doctorId)
        }
//Accessing patients' Profiles: 
    @Get('patients/:id/basic-info') 
    
     async Basic_info(@Param('id', ParseIntPipe) patientId: number): Promise<PatientProfile>{ 
          return await this.ProfileS.BasicP(patientId); 
      } 
  
      @Get('patients/:id/diseases')
      @HttpCode(HttpStatus.OK)
    
      async diseases(@Param('id', ParseIntPipe) patientId: number) : Promise<Disease[]>{
          return await this.ProfileS.diseases(patientId);
      }
      @Get('patients/:id/allergies')
      @HttpCode(HttpStatus.OK)
     
      async allergies(@Param('id', ParseIntPipe) patientId: number) : Promise<Allergy[]>{
          return await this.ProfileS.allergies(patientId);
      }

      @Get('patients/:id/vaccinations')
      @HttpCode(HttpStatus.OK)
     
      async vaccinations(@Param('id', ParseIntPipe) patientId: number) : Promise<Allergy[]>{
          return await this.ProfileS.vaccinations(patientId);
      }
  
   
  
      @Get('patients/:id/medications')
      @HttpCode(HttpStatus.OK)
    
      async medications (@Param('id', ParseIntPipe) patientId: number): Promise<Medication[]>{
          return await this.ProfileS.medications(patientId);
      }

      //Editing patients' profiles: 
      @Post('patients/:id/editBasic')
      @HttpCode(HttpStatus.OK)
      async editBasicPat(@Body(ValidationPipe) dto: PatDTO, @Param('id') patientId: number){
          await this.DocPserv.editBasicPat(dto, patientId)
      }
      @Post('patients/:id/medications/addMeds')
      @HttpCode(HttpStatus.OK)
    
      async addmedications (@Param('id', ParseIntPipe) patientId: number, @Body(ValidationPipe)dto : MedicaDTO): Promise<void>{
        await this.DocPserv.addmedications(patientId, dto);
      }
      @Post('patients/:id/vaccinations/addVacc')
      @HttpCode(HttpStatus.OK)
    
      async addvaccinations (@Param('id', ParseIntPipe) patientId: number, @Body(ValidationPipe)dto : VaccDTO): Promise<void>{
        await this.DocPserv.addvaccination(patientId, dto);
      }
      @Post('patients/:id/allergies/addAll/:name')
      @HttpCode(HttpStatus.OK)
    
      async addallergy (@Param('id', ParseIntPipe) patientId: number, @Param('name') name: string): Promise<void>{
        await this.DocPserv.addallergy(patientId, name);
      }
      @Post('patients/:id/diseases/addDis')
      @HttpCode(HttpStatus.OK)
    
      async adddisease (@Param('id', ParseIntPipe) patientId: number,@Param('name') name: string): Promise<void>{
        await this.DocPserv.adddisease(patientId, name);
      }


      @Get('/:doctorId/patients/:id/specialties/:name/MedicalFiles')
      @HttpCode(HttpStatus.OK)
      
      async getMedicalFiles(@Param('doctorId', ParseIntPipe)doctorId: number, @Param('id', ParseIntPipe) patientId: number, @Param('name') specialtyName: string): Promise<MedicalFile[]>{
        return await this.DocPserv.getMedicalFiles(doctorId, patientId, specialtyName)

      }

  
    @Post(':doctorId/addMedicalFile/:id')
    @HttpCode(HttpStatus.OK)
    async addMedicalFiles(@Param('doctorId', ParseIntPipe) doctorId: number, @Param('id', ParseIntPipe)patientId: number, @Body(ValidationPipe)dto: MedicFDTO){
        await this.DocPserv.addMedicalFiles(doctorId, patientId, dto)
}
}