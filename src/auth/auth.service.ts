import { Injectable, Body, ForbiddenException, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
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
import { User, UserRole } from '@prisma/client';
import { patFDTO } from './dto/patF.dt';
import { docFDTO } from './dto/docF.dto';
import { identity } from 'rxjs';

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
    async LocpatientForm(dto: patFDTO, id:number){
        console.log(id);
        await this.prisma.patientProfile.update({
            where:{
                user_id: id,
            },
            data:{
                
                
                height: dto.height,
                address: dto.adress,
                email: dto.email,
                weight: dto.weight,
                blood_type: dto.bloodtype,
                birthdate: dto.birthdate,
                emergency_contact: dto.emergency,
                gender: dto.gender,
                name: dto.name,
                lastname: dto.lastname,
                phone_number: dto.phonenumber

            }
        })
    }
    async Locsignup(@Body() dto: SupDTO): Promise<Tokens>{
        console.log(dto)
        
        //encrypts password and store it in hash constant
        const hash = await this.hashdata(dto.password);
        
        //console.log(dto.image);
        const newUser = await this.prisma.user.create({
            data: {
              email: dto.email,
              name: dto.name,
              lastname: dto.lastname,
              phone_number: dto.phonenumber,
              image: dto.image,
              password: hash,
            },
          });
          await this.prisma.patientProfile.create({
            data:{
                user_id: newUser.id
            },
          })
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
    async getImage(id: number): Promise<String> {
        const user = await this.prisma.user.findFirst({
          where: {
            id: id
          }
        });
      
        // Assuming user.image is a Buffer of the image bytes
        const base64Image = Buffer.from(user.image).toString('base64');
      
        return base64Image;
      }
    async LocsignupDoc(@Body() dto: docDTO): Promise<Tokens>{
        //check if doctor id valid or not :
        console.log(dto)
     
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
        
        //console.log(doctor);
        
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
              image: dto.image
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
    async checkDocEmail(email: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
          where: {
            email: email,
          },
        });
      
        return !!user;
      }

      async checkId(id: number){
        const user = await this.prisma.user.findFirst({
            where:{
                id: id
            }
        });
        return user;
    }

    async checkIdspec(id: number, specialty: string): Promise<boolean>{
        const user = await this.prisma.user.findFirst({
            where:{
                id: id
            }
        });
        if (user.id && user.Role === "PATIENT"){
            return true;
        }
        const doctor = await this.prisma.doctor.findFirst({
            where:{
                user_id: id
            }
        });
        if(doctor.specialty === specialty){
            return true;
        }

        return false;


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
    async LocdoctorForm(dto: docFDTO, id: number){
        await this.prisma.doctor.update({
            where:{
                user_id: id
            },
            data:{
                name: dto.name,
                lastname: dto.lastname,
                specialty: dto.specialty,
                phoneNumber: dto.phonenumber,
                address: dto.address,
                email: dto.email
            }
        })
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
    async EmergLogin(id: string){
        const staff = await this.prisma.medicalStaffId.findFirst({
            where: {
                used_by: id
            }
        });
        console.log(id)
        const doc = await this.prisma.doctorId.findFirst({
            
            where: {
                id: id
            }
        });
        if((!doc || !doc.id) && (!staff || !staff.used_by)){
            throw new BadRequestException("Invalid ID");
        }
      }
      

      async recognizeFaces(imageUrls: string[]): Promise<User> {
        // Load faceapi models
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromDisk('/home/akm/proj/hello/node_modules/face-api.js/build/commonjs/faceRecognitionNet/face_recognition_model-weights_manifest.json'),
          faceapi.nets.faceLandmark68Net.loadFromDisk('/home/akm/proj/hello/node_modules/face-api.js/build/commonjs/faceLandmarkNet/face_landmark_68_model-weights_manifest.json'),
          faceapi.nets.ssdMobilenetv1.loadFromDisk('/home/akm/proj/hello/node_modules/face-api.js/build/commonjs/faceLandmarkNet/face_landmark_68_model-weights_manifest.json'),
        ]);
    
        // Get all users from the database
        const users = await this.prisma.user.findMany();
    
        for (const imageUrl of imageUrls) {
          // Convert image URL to FaceRecognitionNetInput
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const image = await faceapi.bufferToImage(blob);
          const detection = await faceapi.detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor();
    
          let foundUser = null;
    
          // Iterate over each user and compare their image to the login image
          for (const user of users) {
            // Convert user's stored image string to FaceRecognitionNetInput
            const buffer = Buffer.from(user.image, 'base64');
            const imageBlob = new Blob([buffer], { type: 'image/jpeg' });
            const faceImage = await faceapi.bufferToImage(imageBlob);
            const faceDetection = await faceapi
              .detectSingleFace(faceImage)
              .withFaceLandmarks()
              .withFaceDescriptor();
    
            // Calculate face recognition similarity
            const faceMatcher = new faceapi.FaceMatcher([faceDetection]);
            const similarity = faceMatcher.findBestMatch(
              detection.descriptor
            ).distance;
    
            // If similarity is below a certain threshold, consider the user found
            const SIMILARITY_THRESHOLD = 0.6;
            if (similarity <= SIMILARITY_THRESHOLD) {
              foundUser = user;
              break;
            }
          }
    
          // If a user was found, return it
          if (foundUser) {
            return foundUser;
          }
        }
    
        // If no user was found, reject login
        throw new ForbiddenException('Access Denied');
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
