import { Body, Injectable } from '@nestjs/common';
import { ChatRoom, Message } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocPatDTO, MsgDTO } from './dto';
@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService){}
    //create room : 

    async createchatRoom(doctorId: number, patientId: number): Promise<void>{
        await this.prisma.chatRoom.create({
            data:{
                doctorId,
                patientId
            }
        });

    }
    async getChatRoomById(id: string): Promise<ChatRoom>{
        const chat = await this.prisma.chatRoom.findUnique({
            where:{id: id

            },
            include: {messages: true}
        });

        return chat
    }

   async getChatRoomsForDoctor(doctorId: number): Promise<ChatRoom[]>{
    const doc = await this.prisma.doctor.findUnique({
        where:{
            user_id: doctorId
        },
        include: {chatRooms: true}

    });

    return doc.chatRooms;
   }

   async getChatRoomsForPatient(patientId: number): Promise<ChatRoom[]>{
    const pat = await this.prisma.patientProfile.findUnique({
        where:{
            user_id: patientId
        },
        include: {chatRooms: true}

    });

    return pat.chatRooms;
   }


   async createMessage(@Body()dto: MsgDTO): Promise<Message>{
       const msg =  await this.prisma.message.create({
            data:{
                chatRoomId: dto.chatRoomId,
                sender: dto.senderId,
                content: dto.text
            }
        });


        return msg;
   }

   async getMessagesForChatRoom(@Body() docpat: DocPatDTO): Promise<Message[]>{
        const chat = await this.prisma.chatRoom.findFirst({
            where:{
                doctorId: docpat.docId,
                patientId: docpat.patId
            },
            include: {messages: true}
        });


        return chat.messages;
   }
}
