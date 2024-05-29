import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BacthImportDTO {

  @ApiProperty() @IsNotEmpty()
  readonly fileName: string;

}