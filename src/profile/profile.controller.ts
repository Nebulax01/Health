import { Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport'; import { Request } from 'express'; 
import { ProfileService } from './profile.service';
import { Allergy, Disease, PatientProfile, Doctor, MedicalFile } from '@prisma/client';



 @Controller('profile') 
 export class ProfileController {

     constructor(private ProfileS: ProfileService){ }


  @Post('basic-info') 
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt')) 
   async Basic_info(@Req() req: Request): Promise<PatientProfile>{ 
        return await this.ProfileS.BasicP(req.user['sub']); 
    } 

    @Post('diseases')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt')) 
    async diseases(@Req() req: Request) : Promise<Disease[]>{
        return await this.ProfileS.diseases(req.user['sub']);
    }
    @Post('allergies')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt')) 
    async allergies(@Req() req: Request) : Promise<Allergy[]>{
        return await this.ProfileS.allergies(req.user['sub']);
    }

    @Post('doctors')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt')) 
    async doctors (@Req() req: Request): Promise<Doctor[]>{
        return await this.ProfileS.Doc(req.user['sub']);
    }

    @Post('medications')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt')) 
    async medications (@Req() req: Request): Promise<Doctor[]>{
        return await this.ProfileS.Doc(req.user['sub']);
    }

    @Post('MedicalFiles/:name')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt')) 
    async specialties (@Req() req: Request, @Param('name') specialtyName: string): Promise<MedicalFile[]>{
        return await this.ProfileS.getMedicalFilesForPatientAndSpecialty(req.user['sub'], specialtyName);
    }

}