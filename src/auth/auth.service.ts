import { Injectable, Body, ForbiddenException } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';
import { SupDTO } from './dto/signupdto.dto';
import { docDTO } from './dto/docDto.dto';
import { StaffDTO } from './dto/staffDto.dto';
@Injectable()
export class AuthService {
    //initializing our services
    constructor(private prisma: PrismaService, private jwtService: JwtService){}
    //cryptage pour le password:
    hashdata(data:string){
        return (bcrypt.hash(data, 10));

    }
    //generate tokens : refresh token and access token 

  async  getTokens(userID: number, email: string){
        const [at, rt] = await Promise.all([

        //signAsync : creates JWT tokens based on the properties we provided : sub = userid and email
        this.jwtService.signAsync({
            sub: userID,
            email,
            

        },
        {
            //'at-secret' is our custom key that we used to sign the access token
            secret: 'at-secret',
            expiresIn: 60 * 15,
        }
        ),
        this.jwtService.signAsync({
            sub: userID,
            email,

        },
        {
            //'at-secret' is our custom key that we used to sign the refresh token
            secret: 'rt-secret',
            expiresIn: 60 * 60 * 24 * 7,
        }
        ),
    ]);
    //return our TOken which (2 properties at and rt)
        return {
            access_token: at,
            refresh_token: rt,
        }
    }
    async Locsignup(@Body() dto: SupDTO): Promise<Tokens>{
        //encrypts password and store it in hash constant
        const hash = await this.hashdata(dto.password);
        //create new user having email as dto email and hash
        const newUser = this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              password: hash,
            },
          });
        //create a token object (refresh and access tokens) using the getTokens method 
        const tokens = await this.getTokens((await newUser).id, (await newUser).email)
        //update the refresh token in the user table after having it hashed
        await this.updateRThash((await newUser).id, tokens.refresh_token);
        //console.log(tokens);
        //console.log(`Access token secret: ${process.env.JWT_ACCESS_TOKEN_SECRET}`);
        //console.log(`Refresh token secret: ${process.env.JWT_REFRESH_TOKEN_SECRET}`);

        //return access token so the user can access protected ressources, and the refresh token which he can use to generate a new access token after the one before it expires:
        //server compares user refresh token and the one stored in the database if they match it generates a new access token else it won't
        return tokens;
    }
    async LocsignupDoc(@Body() dto: docDTO): Promise<Tokens>{
        //check if doctor id valid or not :
        const doc_id = dto.doctor_id;
        console.log(doc_id);
        const doctor = await this.prisma.doctorId.findUnique({
            where: {
                used_by : doc_id
            }
        });
        if(!doctor || !doctor.id){
            throw new ForbiddenException("Access denied : invalid Doctor ID");
        }
        
        console.log(doctor);
        //encrypts password and store it in hash constant
        const hash = await this.hashdata(dto.password);
        //create new user having email as dto email and hash
        const newUser = this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              password: hash,
            },
          });
      
       
        const tokens = await this.getTokens((await newUser).id, (await newUser).email)
        
        await this.updateRThash((await newUser).id, tokens.refresh_token);
       
        return tokens;
    }
    async LocsignupStaff(@Body() dto: StaffDTO): Promise<Tokens>{
        //check if staff id valid or not :
        const staff_id = dto.staff_id;
        const staff = await this.prisma.medicalStaffId.findUnique({
            where: {
                used_by : staff_id
            }
        });
        if(!staff || !staff.id){
            throw new ForbiddenException("Access denied : invalid Staff ID");
        }

        //encrypts password and store it in hash constant
        const hash = await this.hashdata(dto.password);
        //create new user having email as dto email and hash
        const newUser = this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              password: hash,
            },
          });
      
       
        const tokens = await this.getTokens((await newUser).id, (await newUser).email)
        
        await this.updateRThash((await newUser).id, tokens.refresh_token);
       
        return tokens;
    }
    async updateRThash(userId: number, rt: string){
        //encrypt the refresh token
        const hash = await this.hashdata(rt);
        //update it in the user table using the unique user id provided
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refresh_token: hash,
            },
        });
    }
    async Locsignin(@Body() dto: AuthDTO): Promise<Tokens>{
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            },
        })
        if(!user) throw new ForbiddenException("Access denied : email doesn't exist");
        const passMatches = await bcrypt.compare(dto.password, user.password);
        if(!passMatches){
            throw new ForbiddenException("Access denied: wrong password");
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRThash(user.id, tokens.refresh_token);
        return tokens;
    }
    async  Loclogout(userId: number){
        console.log(userId);
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                refresh_token: {
                    not : null,
                }
            },
            data: {
                refresh_token: null,
            },
        });
      
    }
    async refreshToken(userId: number, rt: string){
        // console.log(userId);
        // console.log(rt);
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) throw new ForbiddenException("Access Denied");
        //console.log(user.refresh_token);
        //const refrhash = await this.hashdata(rt);
        //console.log(rt);
       // console.log(refrhash);
        const rtMatches = await bcrypt.compare(rt, user.refresh_token);
        if(!rtMatches) throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(userId, user.email);
        await this.updateRThash(userId, tokens.refresh_token);
        return tokens;
    }
}
