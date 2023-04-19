import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class MedicaDTO{
  @IsString()
  @IsNotEmpty()
  name: string
//  @IsDate()
 
 // @IsNotEmpty()
  date: Date
  @IsString()
  @IsNotEmpty()
  disease: string
}