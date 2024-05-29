import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddNoteDTO {

  @ApiProperty() @IsNotEmpty()
  readonly idDonor: number;

  @ApiProperty() @IsNotEmpty()
  text: string;

  // From Auth Header
  @ApiProperty()
  creatorName: string;

  // From Auth Header
  @ApiProperty()
  creatorEmail: string;

}