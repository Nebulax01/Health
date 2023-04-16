import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatRoom } from '@prisma/client';
import { Request } from 'express';
@Controller('chat')
export class ChatController {





    @Post('Rooms')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    async getChatRoomsForDoctor(@Req() req: Request): Promise<ChatRoom[]>{
        return await this.getChatRoomsForDoctor(req.user['sub']);
        
    }
}
