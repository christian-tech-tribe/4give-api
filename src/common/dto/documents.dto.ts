import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DocumentsDto {

    @ApiProperty() @IsNotEmpty()
    readonly ids: string[];

}
