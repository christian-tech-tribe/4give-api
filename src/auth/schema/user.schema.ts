import { Schema } from 'mongoose';

export enum UserStatus {
    NOT_ACTIVE = 'NOT ACTIVE',
    ACTIVE = 'ACTIVE',
}

export enum PlatformRole {
    ADMIN = 'ADMIN',
    PLATFORM_MANAGER = 'PLATFORM MANAGER',
    USER = 'USER',
}

export const UserSchema = new Schema({

    name: String,

    fullname: String,

    email: String,

    password: String,

    thumbnail: String,

    pastThumbnails: [String],

    creationDate: { type: Date, default: Date.now },

    platformRoles: [{
        type: String,
        enum: Object.values(PlatformRole)
    }],

    settings: {},

    status: {
        type: String,
        enum: Object.values(UserStatus)
    },

});

UserSchema.index(
    {

        email: 1,
    },
    {
        unique: true,
    },
);
