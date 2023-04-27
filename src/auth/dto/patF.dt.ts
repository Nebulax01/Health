import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class patFDTO{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    lastname: string;
    @IsDateString()
    @IsNotEmpty()
    birthdate: Date;
    @IsString()
    @IsNotEmpty()
    gender: string;
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    adress: string;
    @IsString()
    @IsNotEmpty()
    phonenumber: string;
    @IsString()
    @IsNotEmpty()
    emergency: string;
    @IsString()
    @IsNotEmpty()
    bloodtype: string;
    
    @IsNotEmpty()
    @IsNumber()
    height: number;
   
    @IsNotEmpty()
    @IsNumber()
    weight: number;
}