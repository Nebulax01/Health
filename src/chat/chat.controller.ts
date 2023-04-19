import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatRoom } from '@prisma/client';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { DocPatDTO, MsgDTO } from './dto';
@Controller('chat')
export class ChatController {

    
}
