import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import * as _ from 'lodash';
import { ObjectDto } from './object.dto';

export class DocumentDto extends ObjectDto {
  
    constructor(object: any = {}) {
        super()
        if ('_id' in object) {
            _.set(this, "id", _.get(object, "_id"))
        }
        else if ('id' in object) {
            _.set(this, "id", _.get(object, "id"))
        }
    }

    @ApiProperty() @IsNotEmpty()
    readonly id: string;
}
