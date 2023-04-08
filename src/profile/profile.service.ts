import { Injectable, Req } from '@nestjs/common'; 
import { Request } from 'express';
 import { PrismaService } from 'src/prisma/prisma.service'; 
 import { BasicInfo } from 'src/basic-u/basic-u.interface';
@Injectable() 
export class ProfileService { 
    constructor(private prisma: PrismaService){ } 
    async BasicP(id: number){
         const usr = await this.prisma.patientProfile.findUnique({
             where:{
                user_id: id
              } 
            }) ;

            // const Buser : BasicInfo = {
            //     name : usr.full_name
    
            // }
        } 
        
    }