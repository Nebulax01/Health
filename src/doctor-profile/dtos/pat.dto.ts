import { IsNotEmpty, IsNumber } from "class-validator"

export class PatDTO{
  @IsNumber()
  @IsNotEmpty()
  weight: number
  @IsNumber()
  @IsNotEmpty()
  height: number

}