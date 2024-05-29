import { Model } from 'mongoose';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { SetPasswordDto } from './dto/setpassword.dto';
import { PlatformRole, UserStatus } from './schema/user.schema';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserIDDto } from './dto/userid.dto';
import { ConfigService } from '@nestjs/config';
// import { DocumentsService } from 'src/documents/documents.service';
// import { SDocumentDto } from 'src/documents/dto/document.dto';
// import { RabbitService } from 'src/rabbit/rabbit.service';

var ObjectId = require('mongoose').Types.ObjectId;

const dotenv = require('dotenv');
dotenv.config()

@Injectable()
export class UsersService {

    constructor(
        // private rabbitService: RabbitService,
        @InjectModel('User') private readonly userModel: Model<User>,
        // private readonly documentService: DocumentsService
        private configService: ConfigService,
    ) {
        let self = this
        setTimeout(_ => self._ensureAdministrator())
    }

    async _ensureAdministrator() {

        let adminEmail = this.configService.get<string>("DEFAULT_ADMIN_USERNAME")

        let user = await this.findByUserID(adminEmail);

        if (!user) {
            user = await this.createNewUser(new CreateUserDto({
                name: "Administrator",
                email: adminEmail,
                fullname: "Administrator",
                platformRole: PlatformRole.ADMIN,
            }))
        }

        user.status = UserStatus.ACTIVE
        user.password = bcrypt.hashSync(this.configService.get<string>("DEFAULT_ADMIN_PASSWORD"), parseInt(process.env.SALT_ROUNDS));
        await user.save();
    }

    async findById(id: String) : Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find({}).exec();
    }

    async findByUserIDActive(userID: UserIDDto): Promise<User> {
        const query = {
            email: userID.email,
            status: UserStatus.ACTIVE
        };
        return await this.userModel.findOne(query).exec();
    }

    async findByUserIDNotActive(userID: UserIDDto): Promise<User> {
        const query = {
            email: userID.email,
            status: UserStatus.NOT_ACTIVE
        };
        return await this.userModel.findOne(query).exec();
    }

    async findByName(name: string): Promise<User> {
        return await this.userModel.findOne({
            name: name,
        }).exec();
    }

    async findByUserID(email: string): Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }

    async find(email: string): Promise<User[]> {
        var query = {};
        if (email) {
            query['email'] = email;
        }
        return await this.userModel.find(query).exec();
    }

    /**
     * User to create is non active and has only email (no password)
     * Other data (name, surname, phone, settings) are optional data
     * that can be modified the user itself.
     * Moreover name, surname and password must be specified when the user
     * accept the invitation
     * 
     * @param newUser User to create
     */
    async createNewUser(newUser: CreateUserDto): Promise<User> {

        if (!this.isValidEmail(newUser.email)) {
            throw new HttpException(
                'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
                HttpStatus.FORBIDDEN,
            );
        }

        var userRegistered = await this.findByUserID(newUser.email);

        // User does not exists
        if (!userRegistered) {

            return await new this.userModel({ 
                email: newUser.email,
                name: newUser.name,
                fullname: newUser.fullname,
                status: UserStatus.NOT_ACTIVE,
                platformRoles: [newUser.platformRole]
            }).save();

        }

        // User already exists but is not ACTIVE
        if (userRegistered.status != UserStatus.ACTIVE) {
            return userRegistered;
        }
        
        throw new HttpException('REGISTRATION.USER_ALREADY_REGISTERED',HttpStatus.FORBIDDEN);
    }

    /**
     * Ensure that an user exists and is active.
     * In case the user is newly created, the list of roles is associated
     * 
     * @param user 
     */
    async upsertActiveUser(user: CreateUserDto) : Promise<User> {
        let userRegistered = await this.findByUserID(user.email);
        if (userRegistered) {
            if (userRegistered.status != UserStatus.ACTIVE) {
                userRegistered.status = UserStatus.ACTIVE
                return await userRegistered.save();
            }
            return userRegistered
        } else {
            return await new this.userModel({ 
                email: user.email,
                name: user.name,
                fullname: user.fullname,
                status: UserStatus.ACTIVE,
                platformRoles: [user.platformRole]
            }).save();
        }
    }

    async updatePassword(setPassword: SetPasswordDto): Promise<boolean> {

        const newPasswordHash = bcrypt.hashSync(setPassword.newPassword, parseInt(process.env.SALT_ROUNDS));

        let userFromDb = await this.findByUserID(setPassword.email)
        if (!userFromDb) {
            throw new HttpException('PASSWORD.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        if (userFromDb.password) {
            if (!await bcrypt.compare(setPassword.oldPassword, userFromDb.password)) {
                throw new HttpException('PASSWORD.NOT_MATCH', HttpStatus.NOT_FOUND);
            }
        }

        if (userFromDb.status != UserStatus.ACTIVE) {
            userFromDb.status = UserStatus.ACTIVE
        }
        userFromDb.password = newPasswordHash;
        await userFromDb.save();

        return true;
    }

    async clearPicture(userId: string) : Promise<User> {
        let user = await this.userModel.findById(userId);
        if (!user) {
            throw new HttpException(
                'COMMON.USER_NOT_FOUND',
                HttpStatus.NOT_FOUND,
            );
        }
        if (user.thumbnail) {
            if (user.pastThumbnails) {
                user.pastThumbnails = [...user.pastThumbnails, user.thumbnail]
            }
            else {
                user.pastThumbnails = [user.thumbnail]
            }
            user.thumbnail = null;
        }
        let newUser = await user.save();
        // await this.rabbitService.update("user", newUser.id)
        return newUser
    }

    // async updatePicture(document: SDocumentDto, id: string): Promise<User> {
    //     let user = await this.userModel.findById(id);
    //     if (!user) {
    //         throw new HttpException(
    //             'COMMON.USER_NOT_FOUND',
    //             HttpStatus.NOT_FOUND,
    //         );
    //     }
    //     let response = await this.documentService.upload(document)
    //     console.log("uploaded:", response);
    //     if (user.thumbnail) {
    //         if (user.pastThumbnails) {
    //             user.pastThumbnails = [...user.pastThumbnails, user.thumbnail]
    //         }
    //         else {
    //             user.pastThumbnails = [user.thumbnail]
    //         }
    //     }
    //     user.thumbnail = "/api/v1/documents/download?id=" + response.id;
    //     let newUser = await user.save();
    //     await this.rabbitService.update("user", newUser.id)
    //     return newUser;
    // }

    async updateUserSettings(userSettings: UserSettingsDto): Promise<User> {

        var userFromDb = await this.userModel.findOneAndUpdate({
            email: userSettings.email,
            status: UserStatus.ACTIVE
        }, {
            settings: userSettings.settings || {},
        }, {
            new: true
        }).exec();

        if (!userFromDb)
            throw new HttpException(
                'COMMON.USER_NOT_FOUND',
                HttpStatus.NOT_FOUND,
            );

        // Do not share the password hash
        userFromDb.password = null;
        // await this.rabbitService.update("user", userFromDb.id)
        return userFromDb;
    }

    private isValidEmail(email: string) {
        if (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        } else return false;
    }
}
