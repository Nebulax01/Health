import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator'
export class docDTO{
    @IsNotEmpty()
    @IsString()
    doctor_id: string
    @IsNotEmpty()
    @IsString()

    name: string
    @IsNotEmpty()
    @IsString()
    lastname: string
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsString()
    password: string
    @IsNotEmpty()
    @IsString()
    phonenumber: string
}