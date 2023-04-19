import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport'; import { Request } from 'express'; 
import { ProfileService } from './profile.service';
import { Allergy, Disease, PatientProfile, Doctor, MedicalFile, ChatRoom, Message } from '@prisma/client';
import { ChatService } from 'src/chat/chat.service';
import { MsgDTO } from 'src/chat/dto';



 @Controller('profile') 
 export class ProfileController {

     constructor(private ProfileS: ProfileService, private chat: ChatService){ }

    // profile: 
  @Post('/:id/basic-info') 
  @HttpCode(HttpStatus.OK)
 
   async Basic_info(@Param('id') patientId: number): Promise<PatientProfile>{ 
        return await this.ProfileS.BasicP(patientId); 
    } 

    @Post('/:id/diseases')
    @HttpCode(HttpStatus.OK)
    
    async diseases(@Param('id') patientId: number) : Promise<Disease[]>{
        return await this.ProfileS.diseases(patientId);
    }
    @Post('/:id/allergies')
    @HttpCode(HttpStatus.OK)
    
    async allergies(@Param('id') patientId: number) : Promise<Allergy[]>{
        return await this.ProfileS.allergies(patientId);
    }

    @Post('/:id/doctors')
    @HttpCode(HttpStatus.OK)
   
    async doctors (@Param('id') patientId: number): Promise<Doctor[]>{
        return await this.ProfileS.Doc(patientId);
    }

    @Post('/:id/medications')
    @HttpCode(HttpStatus.OK)
    
    async medications (@Param('id') patientId: number): Promise<Doctor[]>{
        return await this.ProfileS.Doc(patientId);
    }
 
    @Get('/:id/specialties/:name/MedicalFiles')
    @HttpCode(HttpStatus.OK)
    
    async getMedicalFiles (@Param('id') patientId: number, @Param('name') specialtyName: string): Promise<MedicalFile[]>{
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