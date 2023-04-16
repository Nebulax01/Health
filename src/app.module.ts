import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { DoctorProfileController } from './doctor-profile/doctor-profile.controller';
import { DoctorProfileService } from './doctor-profile/doctor-profile.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [AuthModule, PrismaModule, ChatModule],
  controllers: [AppController, ProfileController, DoctorProfileController],
  providers: [AppService, ProfileService, DoctorProfileService, AuthService, JwtService, ChatService],
})
export class AppModule {}
