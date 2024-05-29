import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ModifyNoteDTO {

  @ApiProperty() @IsNotEmpty()
  readonly idNote: number;

  @ApiProperty() @IsNotEmpty()
  text: string;

  // From Auth Header
  @ApiProperty()
  updaterName: string;

  // From Auth Header
  @ApiProperty()
  updaterEmail: string;

}