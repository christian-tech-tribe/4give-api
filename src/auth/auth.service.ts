import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { Model } from 'mongoose';
import { UserDto } from '../users/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { UserIDDto } from '../users/dto/userid.dto';
import { ForgottenPassword } from './interface/forgottenpassword.interface';
import { UserStatus } from '../users/schema/user.schema';
import { LoginDto } from './dto/login.dto';

const dotenv = require('dotenv');
dotenv.config();

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class AuthService {
    constructor(
        // @InjectModel('User') private readonly userModel: Model<User>,
        // @InjectModel('ForgottenPassword') private readonly forgottenPasswordModel: Model<ForgottenPassword>,
        private readonly jwtService: JWTService,
        private readonly usersService: UsersService,
    ) {}

    async validateLogin(loginDto: LoginDto) {
        var userFromDb = await this.usersService.findByUserIDActive(loginDto)
        if (!userFromDb)
            throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

        if (userFromDb.status != UserStatus.ACTIVE) {
            throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
        }

        var isValidPass = await bcrypt.compare(loginDto.password, userFromDb.password);

        if (isValidPass) {
            var accessToken = await this.jwtService.createToken(
                userFromDb.email,
                userFromDb.id,
                userFromDb.platformRoles,
            );
            return { token: accessToken, user: new UserDto(userFromDb) };
        } else {
            throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
        }
    }

    /*
    async createForgottenPasswordToken(userID: UserIDDto): Promise<ForgottenPassword> {
        var forgottenPassword = await this.forgottenPasswordModel.findOne({
            email: userID.email,
        });
        if (
            forgottenPassword &&
            (new Date().getTime() - forgottenPassword.timestamp.getTime()) /
                60000 <
                15
        ) {
            throw new HttpException(
                'RESET_PASSWORD.EMAIL_SENDED_RECENTLY',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } else {
            var forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
                { 
                    email: userID.email 
                },
                {
                    newPasswordToken: (Math.floor(Math.random() * 9000000) + 1000000).toString(), //Generate 7 digits number,
                    timestamp: new Date(),
                },
                { upsert: true, new: true },
            );
            if (forgottenPasswordModel) {
                return forgottenPasswordModel;
            } else {
                throw new HttpException(
                    'LOGIN.ERROR.GENERIC_ERROR',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async getForgottenPasswordModel(
        newPasswordToken: string,
    ): Promise<ForgottenPassword> {
        return await this.forgottenPasswordModel.findOne({
            newPasswordToken: newPasswordToken,
        });
    }

    async checkPassword(email: string, password: string) {
      
        const userFromDb = await this.usersService.findByUserID(new UserIDDto({
          email: email,
        }))
        
        if (!userFromDb) {
            throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        }

        return await bcrypt.compare(password, userFromDb.password);
    }

    async sendEmailForgotPassword(userID: UserIDDto): Promise<boolean> {
        var userFromDb = await this.usersService.findByUserID(userID);
        if (!userFromDb)
            throw new HttpException(
                'LOGIN.USER_NOT_FOUND',
                HttpStatus.NOT_FOUND,
            );

        var tokenModel = await this.createForgottenPasswordToken(userID);

        if (tokenModel && tokenModel.newPasswordToken) {
            return new Promise<boolean>(function(resolve, reject) {
                try {
                    const msg = {
                        to: userID.email,
                        from: process.env.SENDGRID_EMAIL_SENDER,
                        subject: 'Frogotten Password',
                        text: 'Forgot Password',
                        html:
                            'Hi! <br><br> If you requested to reset your password<br><br>' +
                            '<a href=' +
                            process.env.FRONTEND_ENDPOINT +
                            '/api/v1/auth/email/reset-password/' +
                            tokenModel.newPasswordToken +
                            '>Click here</a>', // html body,
                    };
                    // sgMail.send(msg);
                    resolve(true);
                } catch (e) {
                    resolve(false);
                }
            });
        } else {
            throw new HttpException(
                'REGISTER.USER_NOT_REGISTERED',
                HttpStatus.FORBIDDEN,
            );
        }
    }
    */
}
