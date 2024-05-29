import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateExpenseDTO {

  @ApiProperty()
  readonly campaignCode: string;

  @ApiProperty() @IsNotEmpty()
  readonly amount: number;

  @ApiProperty() @IsNotEmpty()
  readonly currency: string;

  @ApiProperty() @IsNotEmpty()
  readonly description: string;

  @ApiProperty() @IsNotEmpty()
  readonly date: Date;

}