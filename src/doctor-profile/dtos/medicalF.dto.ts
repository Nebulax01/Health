import { IsNotEmpty, IsString } from "class-validator"

export class MedicFDTO{
  @IsString()
  @IsNotEmpty()
  specialtyName: string
  @IsString()
  @IsNotEmpty()
  description: string
  @IsString()
  @IsNotEmpty()
  name: string
}