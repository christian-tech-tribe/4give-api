import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { UserIDDto } from "./userid.dto";

export class LoginDto extends UserIDDto {

  constructor(object: any = {}) {
    super(object);
    this.getField(object, "password");
  }

  @ApiProperty() @IsNotEmpty()
  readonly password: string;
  
}