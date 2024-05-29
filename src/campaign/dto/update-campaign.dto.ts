import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCampaignDTO {

  @ApiProperty() @IsNotEmpty()
  readonly id: number;

  @ApiProperty() @IsNotEmpty()
  readonly title: string;

  @ApiProperty() @IsNotEmpty()
  readonly objectives: string;

  @ApiProperty()
  readonly tools: string;

}