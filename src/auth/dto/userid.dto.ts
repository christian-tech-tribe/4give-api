import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ObjectDto } from "../../common/dto/object.dto";

export class UserIDDto extends ObjectDto {

  constructor(object: any) {
    super()
    this.getField(object, "email")
  };

  @ApiProperty() @IsEmail() @IsNotEmpty()
  readonly email: string;

}