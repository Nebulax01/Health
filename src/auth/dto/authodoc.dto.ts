import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDocDTO{
    @IsEmail()
    email: string
    @IsString()
    @IsNotEmpty()
    password: string
    @IsString()
    @IsNotEmpty()
    id: string
}