import { IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";
import { DonationMode } from "../entity/donation.entity";

export class AddDonationDTO {

  @ApiProperty() @IsNotEmpty()
  readonly idDonor: number;

  @ApiProperty()
  readonly idCampaign: number;

  @ApiProperty() @IsNotEmpty()
  amount: number

  @ApiProperty() @IsNotEmpty()
  currency: string;

  @ApiProperty() @IsNotEmpty()
  paymentDate: string;

  @ApiProperty() @IsNotEmpty() @IsEnum(DonationMode)
  mode: DonationMode

}