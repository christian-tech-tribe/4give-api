import { Body, Controller, HttpCode, HttpStatus, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { IResponse } from 'src/common/interfaces/response.interface';
import { LoginDto } from './dto/login.dto';

@Controller('/api/v1/auth')
@ApiTags('Auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {

    constructor(
      private readonly authService: AuthService,
      private readonly jwtService: JWTService,
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginDto: LoginDto): Promise<IResponse> {
      try {
        var response = await this.authService.validateLogin(loginDto);
        return new ResponseSuccess("LOGIN.SUCCESS", response);
      } catch(error) {
        return new ResponseError("LOGIN.ERROR", error);
      }
    }

}
