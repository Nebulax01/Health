import { IsNotEmpty, IsString } from "class-validator"

export class MedicFDTO{
  @IsString()
  @IsNotEmpty()
  specialtyName: string
  @IsString()
  @IsNotEmpty()
  url: string
  @IsString()
  @IsNotEmpty()
  name: string
}