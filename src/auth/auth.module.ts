import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { atStrat, rtStrat } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, atStrat, rtStrat, PrismaService],
  imports: [JwtModule.register({})]

})
export class AuthModule {}
