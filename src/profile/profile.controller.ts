import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
 import { AuthGuard } from '@nestjs/passport'; import { Request } from 'express'; 
import { ProfileService } from './profile.service';
 @Controller('profile') 
 export class ProfileController {
     constructor(private ProfileS: ProfileService){ }
  @Post('basic-info') 
  @HttpCode(HttpStatus.OK)
   @UseGuards(AuthGuard('jwt')) 
   async Basic_info(@Req() req: Request){ 
    return await this.ProfileS.BasicP(req.user['sub']); 
} 
}