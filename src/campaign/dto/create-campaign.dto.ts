import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCampaignDTO {

  @ApiProperty() @IsNotEmpty()
  readonly code: string;

  @ApiProperty() @IsNotEmpty()
  readonly title: string;

  @ApiProperty() @IsNotEmpty()
  readonly objectives: string;

  @ApiProperty()
  readonly tools: string;

}