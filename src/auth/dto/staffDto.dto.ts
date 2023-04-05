import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator'
export class StaffDTO{
    @IsNotEmpty()
    @IsString()
    staff_id: string
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