import { Injectable, Body, ForbiddenException } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.type';
import { SupDTO } from './dto/signupdto.dto';
import { docDTO } from './dto/docDto.dto';
import { StaffDTO } from './dto/staffDto.dto';
import * as faceapi from 'face-api.js';
import { AuthDocDTO } from './dto/authodoc.dto';
import { UserRole } from '@prisma/client';

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
    async  getStTokens(userID: number){
        const [at, rt] = await Promise.all([

        //signAsync : creates JWT tokens based on the properties we provided : sub = userid and email
        this.jwtService.signAsync({
            sub: userID,
       
            

        },
        {
            //'at-secret' is our custom key that we used to sign the access token
            secret: 'at-secret',
            expiresIn: 60 * 15 * 60 * 60,
        }
        ),
        this.jwtService.signAsync({
            sub: userID,
          

        },
        {
            //'at-secret' is our custom key that we used to sign the refresh token
            secret: 'rt-secret',
            expiresIn: 60 * 60 * 24 * 7 * 60 * 60,
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
        
        //console.log(dto.image);
        const newUser = this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              image: dto.image,
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
                id : doc_id
            }
        });
        console.log(doctor);
        if(!doctor || !doctor.id){
            throw new ForbiddenException("Access denied : invalid Doctor ID");
        }
        
        console.log(doctor);
        //encrypts password and store it in hash constant
        const hash = await this.hashdata(dto.password);
        //create new user having email as dto email and hash
        const newUser = await this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              Role: 'DOCTOR',
              password: hash,
            },
          });
        const doC = await this.prisma.doctor.create({
            data:{
                doctor_id: dto.doctor_id,
                user_id: newUser.id,
            }
        })
       
        const tokens = await this.getTokens((await newUser).id, (await newUser).email)
        
        await this.updateRThash((await newUser).id, tokens.refresh_token);
       
        return tokens;
    }
    // async LocsignupStaff(@Body() dto: StaffDTO): Promise<Tokens>{
    //     //check if staff id valid or not :
    //     const staff_id = dto.staff_id;
    //     const staff = await this.prisma.medicalStaffId.findUnique({
    //         where: {
    //             used_by : staff_id
    //         }
    //     });
    //     if(!staff || !staff.id){
    //         throw new ForbiddenException("Access denied : invalid Staff ID");
    //     }

    //     //encrypts password and store it in hash constant
    //     const hash = await this.hashdata(dto.password);
    //     //create new user having email as dto email and hash
    //     const newUser = this.prisma.user.create({
    //         data: {
    //           email: dto.email,
    //           name: dto.name,
    //           lastname: dto.lastname,
    //           phone_number: dto.phonenumber,
    //           password: hash,
    //         },
    //       });
      
       
    //     const tokens = await this.getTokens((await newUser).id, (await newUser).email)
        
    //     await this.updateRThash((await newUser).id, tokens.refresh_token);
       
    //     return tokens;
    // }
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
    async updateRThash2(userId: number, rt: string){
        //staff.id
        //encrypt the refresh token
        const hash = await this.hashdata(rt);
        console.log(userId);
      
        await this.prisma.medicalStaffId.update({
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
        const tokens = await this.getTokens(user.id, user.email,);
        await this.updateRThash(user.id, tokens.refresh_token);
        return tokens;
    }
    async LocsigninDoc(@Body() dto: AuthDocDTO):Promise<Tokens>{
        const doc = await this.prisma.doctor.findUnique({
            where:{
                doctor_id: dto.id
            }
        });
        if(!doc || !doc.doctor_id){
            throw new ForbiddenException("Access denied : your doctor ID doesn't exist!");
        }
        const usr = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });
        if(!usr) throw new ForbiddenException("Access denied : email doesn't exist");
        const passMatches = await bcrypt.compare(dto.password, usr.password);
        if(!passMatches){
            throw new ForbiddenException("Access denied: wrong password");
        }
        const tokens = await this.getTokens(usr.id, usr.email);
        await this.updateRThash(usr.id, tokens.refresh_token);
        return tokens;
    }
    async  Loclogout(userId: number){
        // console.log(userId);
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
    async EmergLogin(staffId: string,image : string){
        const tokens = {'access_token': null, 'refresh_token': null};
       
        const staff = await this.prisma.medicalStaffId.findUnique({
            where: {
                used_by: staffId
            }
        });
        console.log(staffId)
        const doc = await this.prisma.doctorId.findUnique({
            
            where: {
                id: staffId
            }
        });
        if((!doc || !doc.id) && (!staff || !staff.used_by)){
            throw new ForbiddenException("Access Denied" );
        }

        const user = await this.prisma.user.findUnique({
            where:{
                image : image
            }
        });
        // Load FaceAPI models
  // Load faceapi models
await Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./models')
  ]);
  
  // Convert user's stored image string to FaceRecognitionNetInput
  const buffer = Buffer.from(user.image, 'base64');
  const imageBlob = new Blob([buffer], { type: 'image/jpeg' });
  const faceImage = await faceapi.bufferToImage(imageBlob);
  const faceDetection = await faceapi.detectSingleFace(faceImage).withFaceLandmarks().withFaceDescriptor();
  
  // Convert login image string to FaceRecognitionNetInput
  const loginBuffer = Buffer.from(image, 'base64');
  const loginImageBlob = new Blob([loginBuffer], { type: 'image/jpeg' });
  const loginFaceImage = await faceapi.bufferToImage(loginImageBlob);
  const loginFaceDetection = await faceapi.detectSingleFace(loginFaceImage).withFaceLandmarks().withFaceDescriptor();
  
  // Calculate face recognition similarity
  const faceMatcher = new faceapi.FaceMatcher([faceDetection]);
  const similarity = faceMatcher.findBestMatch(loginFaceDetection.descriptor).distance;
  
  // If similarity is below a certain threshold, reject login
  const SIMILARITY_THRESHOLD = 0.6;
  if (similarity > SIMILARITY_THRESHOLD) {
    throw new ForbiddenException('Access Denied');
  }
  

   
        if(!(!doc || !doc.id)){
            console.log("slm");
            const tokens = await this.getStTokens(doc.idx);

        await this.updateRThash(doc.idx, tokens.refresh_token);
        return tokens;
        }
        
        if(!((!staff || !staff.used_by))){
            console.log("slm1");
            console.log(staff.id);
            const tokens = await this.getStTokens(staff.id);

        await this.updateRThash2(staff.id, tokens.refresh_token);
        return tokens;
        }
        

        return tokens;

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
