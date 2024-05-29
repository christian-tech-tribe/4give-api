import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PlatformRole } from "../schema/user.schema";
import { UserIDDto } from "./userid.dto";

export class CreateUserDto extends UserIDDto {

  constructor(object: any) {
    super(object)
    this.getField(object, "name")
    this.getField(object, "fullname")
    this.getField(object, "platformRole")
  }

  @ApiProperty() @IsNotEmpty()
  readonly name: string;

  @ApiProperty() @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty() @IsEnum(PlatformRole) @IsNotEmpty()
  readonly platformRole: PlatformRole;
  
}