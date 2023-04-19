import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class VaccDTO{
  @IsNotEmpty()
  @IsString()
  name: string
  @IsNotEmpty()
  @IsDate()
  date: Date
}