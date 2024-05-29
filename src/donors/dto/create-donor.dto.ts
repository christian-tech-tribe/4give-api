import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDonorDTO {

  @ApiProperty() @IsNotEmpty()
  readonly name: string;

  @ApiProperty() @IsNotEmpty()
  readonly address: string;
  
}