import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomTokenMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService){}
  async use(@Req() req: Request, patientId: number, next: NextFunction) {
    
    const patient = await this.prisma.patientProfile.findUnique({
        where:{
            user_id: patientId
        }
    });
    
    const patientEmail = patient.user_id;
 
    const token = jwt.sign({ id: patientId, email: patientEmail, role: 'DOCTOR' }, 'at-secret');
    
    // Attach the custom token to the request object
    req.headers['authorization'] = `Bearer ${token}`;
    
    console.log(token);
    //console.log(req);
    next();
  }
}
