import { Document, Schema } from 'mongoose';
import { PlatformRole, UserStatus } from '../schema/user.schema';

export interface User extends Document {

    name: string;

    fullname: string;

    email: string;

    password: string;

    thumbnail: string;

    pastThumbnails: string[];

    creationDate: Date;

    platformRoles: [PlatformRole];

    settings: {};

    status: UserStatus;

}
