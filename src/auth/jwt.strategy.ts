import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWTService } from './jwt.service';
import { UsersService } from 'src/users/users.service';
import { UserIDDto } from './dto/userid.dto';

const dotenv = require('dotenv');
dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly jwtService: JWTService,
    private readonly usersService: UsersService
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: process.env.JWT_SECRET,
      }
    );
  }

  public async validate(payload: any, req: any, done: Function) {
    const user = await this.usersService.findByUserIDActive(new UserIDDto({
      email: req.email
    }));
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }

}
