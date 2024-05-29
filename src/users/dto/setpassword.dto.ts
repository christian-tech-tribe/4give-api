import { IsNotEmpty, IsString, IsDate, IsEmail, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ObjectDto } from "../../common/dto/object.dto";

export class SetPasswordDto extends ObjectDto {

  constructor(object: any) {
    super()
    this.getField(object, "email")
    this.getField(object, "oldPassword")
    this.getField(object, "newPassword")
  }

  @ApiProperty() @IsEmail() @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  readonly oldPassword: string | null;

  @ApiProperty() @IsString() @IsNotEmpty()
  readonly newPassword: string;

}