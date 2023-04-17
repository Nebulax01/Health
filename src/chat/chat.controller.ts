import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatRoom } from '@prisma/client';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { DocPatDTO, MsgDTO } from './dto';
@Controller('chat')
export class ChatController {

    constructor(private chat: ChatService){}



    @Post('Rooms')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getChatRoomsForDoctor(@Req() req: Request): Promise<ChatRoom[]>{
        return await this.chat.getChatRoomsForDoctor(req.user['sub']);
        
    }

    @Post('message')
    @HttpCode(HttpStatus.OK)
    //@UseGuards(AuthGuard('jwt'))
    async  cmsg(@Body() dto: MsgDTO){
        return await this.chat.createMessage(dto)

    }
    @Post('chatroom')
    async getMessagesForChatRoom(@Body() docpat: DocPatDTO){
        return await this.chat.getMessagesForChatRoom(docpat)
    }

    @Post('Rooms/:id')
    async getChatRoomById(@Param('id') chatroomId: string){
        return await this.chat.getChatRoomById(chatroomId)
    }

}
