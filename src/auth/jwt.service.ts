import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { PlatformRole } from '../users/schema/user.schema';

const dotenv = require('dotenv');
dotenv.config();

@Injectable()
export class JWTService {

    async createToken(email: string, id: string, roles: [PlatformRole], expiresIn: string = process.env.JWT_EXPIRES_IN) {
        const secretOrKey = process.env.JWT_SECRET;
        const userInfo = { 
          email: email,
          userId: id, 
          roles: roles 
        };
        const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

    async verify() {

    }


}
