import { Controller,Post, Body, HttpCode, Header, HttpStatus, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { Tokens } from './types/tokens.type';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SupDTO } from './dto/signupdto.dto';
import { docDTO } from './dto/docDto.dto';
import { StaffDTO } from './dto/staffDto.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ){}

    @Post('/signup/user')
    @HttpCode(HttpStatus.CREATED)
    async Locsignup(@Body() dto: SupDTO): Promise<Tokens>{
       
        const tokens = await this.authService.Locsignup(dto);
  return tokens;
    }
    @Post('/signup/doctor')
    @HttpCode(HttpStatus.CREATED)
    async LocsignupDoc(@Body() dto: docDTO): Promise<Tokens>{
       
        const tokens = await this.authService.LocsignupDoc(dto);
  return tokens;
    }
    @Post('/signup/staff')
    @HttpCode(HttpStatus.CREATED)
    async LocsignupStaff(@Body() dto: StaffDTO): Promise<Tokens>{
       
        const tokens = await this.authService.LocsignupStaff(dto);
  return tokens;
    }
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async Locsignin(@Body() dto: AuthDTO): Promise<Tokens>{
       const tokens = await this.authService.Locsignin(dto);
        return tokens;
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
   async  Loclogout(@Req() req: Request){
        const user = req.user;
        console.log(user);
        console.log(user['sub']);
        return this.authService.Loclogout(user['sub']);

    }
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('/refresh')
    refreshToken(@Req() req: Request){
        const user = req.user;
        console.log(user);
        return this.authService.refreshToken(user['sub'], user['refreshToken']);
    }
}
