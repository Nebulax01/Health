import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport'; import { Request } from 'express'; 
import { ProfileService } from './profile.service';
import { Allergy, Disease, PatientProfile, Doctor, MedicalFile, ChatRoom, Message, Medication } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { MsgDTO } from 'src/chat/dto';



 @Controller('profile') 
 export class ProfileController {

     constructor(private ProfileS: ProfileService, private chat: ChatService){ }

    // profile: 
    
  @Get('/:id/basic-info') 
  @HttpCode(HttpStatus.OK)
 
   async Basic_info(@Param('id', ParseIntPipe) patientId: number): Promise<PatientProfile>{ 
        return await this.ProfileS.BasicP(patientId); 
    } 

    @Get('/:id/diseases')
    @HttpCode(HttpStatus.OK)
    
    async diseases(@Param('id', ParseIntPipe) patientId: number) : Promise<Disease[]>{
        return await this.ProfileS.diseases(patientId);
    }
    @Get('/:id/allergies')
    @HttpCode(HttpStatus.OK)
    
    async allergies(@Param('id',ParseIntPipe) patientId: number) : Promise<Allergy[]>{
        return await this.ProfileS.allergies(patientId);
    }
    @Get('/:id/vaccinations')
    @HttpCode(HttpStatus.OK)
    
    async vaccinations(@Param('id',ParseIntPipe) patientId: number) : Promise<Allergy[]>{
        return await this.ProfileS.vaccinations(patientId);
    }
    @Post('/:id/doctors')
    @HttpCode(HttpStatus.OK)
   
    async doctors (@Param('id') patientId: number): Promise<Doctor[]>{
        return await this.ProfileS.Doc(patientId);
    }

    @Get('/:id/medications')
    @HttpCode(HttpStatus.OK)
    
    async medications (@Param('id', ParseIntPipe) patientId: number): Promise<Medication[]>{
        return await this.ProfileS.medications(patientId);
    }
 
    @Get('/:id/specialties/:name/MedicalFiles')
    @HttpCode(HttpStatus.OK)
    
    async getMedicalFiles (@Param('id', ParseIntPipe) patientId: number, @Param('name') specialtyName: string): Promise<MedicalFile[]>{
        return await this.ProfileS.getMedicalFilesForPatientAndSpecialty(patientId, specialtyName);
    }
    //chat: 
    @Get('/:patientId/chatRooms')
    @HttpCode(HttpStatus.OK)
    
    async getChatRoomsForPatient(@Param('patientId', ParseIntPipe)patientId: number): Promise<ChatRoom[]>{
        return await this.chat.getChatRoomsForPatient(patientId);
        
    }
    @Get('/:patientId/chatRooms/:doctorId')
    @HttpCode(HttpStatus.OK)
    
    async getMessagesForChatRoom(@Param('doctorId', ParseIntPipe)doctorId: number, @Param('patientId', ParseIntPipe) patientId: number): Promise<Message[]>{
        return await this.chat.getMessagesForChatRoom(doctorId, patientId);
        
    }

    @Post('/:patientId/chatRooms/:chatroomId/sendMsg/:doctorId')
    @HttpCode(HttpStatus.OK)
    async createMessage(@Param('patientId') senderId: string, @Param('chatroomId') chatroomId: string, @Body(ValidationPipe)dto: MsgDTO): Promise<Message>{
        return await this.chat.createMessage(senderId, chatroomId, dto)
    }

}