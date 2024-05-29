import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JWTService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { ForgottenPasswordSchema } from './schema/forgottenpassword.schema';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

const dotenv = require('dotenv');
dotenv.config();

@Module({
    providers: [AuthService, JWTService, JwtStrategy],
    exports: [AuthService, JWTService],
    controllers: [AuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        /*
        MongooseModule.forFeature([
            { name: 'ForgottenPassword', schema: ForgottenPasswordSchema },
        ])
        */
    ],
})
export class AuthModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(AuthController);
    }
}
