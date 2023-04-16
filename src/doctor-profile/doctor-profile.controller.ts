import { Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorProfileService } from './doctor-profile.service';
import { ChatRoom, Doctor, Message, PatientProfile } from '@prisma/client';
import { CustomTokenAuthGuard } from './doctor-auth.guard';

import { Request } from 'express';
import { CustomTokenMiddleware } from './custom.middleware';
import { ChatService } from 'src/chat/chat.service';



@Controller('doctorP')
export class DoctorProfileController {
    constructor (private DocPserv: DoctorProfileService, private chat: ChatService){}


    @Post('basic-info')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getDocBinfo(@Req() req: Request): Promise<Doctor>{
      console.log(req.user['sub']);
        return await this.DocPserv.getDocBinfo(req.user['sub']);
    }


    //what in the fuck
    // @Post('patientProfile')
    // @HttpCode(HttpStatus.OK)
    // @UseGuards(AuthGuard('jwt'))
    // @UseGuards(CustomTokenMiddleware)
    // @UseGuards(AuthGuard('jwt'))
    
  
    // async getPatientP(@Req() req: Request): Promise<PatientProfile>{

    //   return this.DocPserv.getPatient(req['sub']);
        
    // }

    @Post('addPatient')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async addPatient(@Req() req: Request):Promise<void>{
      const email = "patient3@gmail.com"
     // console.log(req.user['sub']);
      await this.DocPserv.addPatient(req.user['sub'], email);
  }

  @Post('chatRooms')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getChatRoomsForDoctor(@Req() req: Request): Promise<ChatRoom[]>{
        return await this.chat.getChatRoomsForDoctor(req.user['sub']);
        
    }
    @Post('chatRooms/:patientId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getMessagesForChatRoom(@Req() req: Request, @Param('patientId')patientId : number): Promise<Message[]>{
        return await this.chat.getMessagesForChatRoom(req.user['sub'], patientId);
        
    }
    
}
