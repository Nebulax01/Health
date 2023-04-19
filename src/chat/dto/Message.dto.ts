import { IsNotEmpty, IsString } from "class-validator";

export class MsgDTO{
  @IsString()
  @IsNotEmpty()
  text: string
}