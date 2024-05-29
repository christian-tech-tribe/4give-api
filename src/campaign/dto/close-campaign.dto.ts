import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CloseCampaignDTO {

  @ApiProperty() @IsNotEmpty()
  readonly id: number;
  
}