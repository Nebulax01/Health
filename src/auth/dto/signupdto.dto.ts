import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
export class SupDTO{
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
    @IsNotEmpty()
    @IsString()
    image: string
}