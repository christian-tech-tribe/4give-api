import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ObjectDto } from "../../common/dto/object.dto";

export class UserSettingsDto extends ObjectDto {

  constructor(object: any) {
    super()
    this.getField(object, "email")
    this.getField(object, "settings")
  }

  @ApiProperty() @IsEmail() @IsNotEmpty()
  readonly email: string;

  @ApiProperty() 
  readonly settings = {};
  
}