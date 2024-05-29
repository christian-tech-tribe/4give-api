import { Controller, Post, Body, Req, UseGuards, Param, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { IResponse } from '../common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserIDDto } from './dto/userid.dto';
import { SetPasswordDto } from './dto/setpassword.dto';
import { UserSettingsDto } from './dto/user-settings.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@ApiBearerAuth()
@Controller('/api/v1/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    
    constructor(private readonly usersService: UsersService) {}

    // @Post('/test')
    // async test(@Body() body: any, @Req() request: Request): Promise<IResponse> {
    //     console.log(request.headers['X-Auth-Email'])
    //     console.log(body)
    //     return new ResponseSuccess('COMMON.SUCCESS');
    // }

    @Put('/')
    async createUser(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
        try {
            let user = await this.usersService.createNewUser(createUserDto);
            return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user));
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Post('/all')
    async findAll(@Req() req): Promise<IResponse> {
        try {
            let users = await this.usersService.findAll() || [];
            return new ResponseSuccess('COMMON.SUCCESS', users.map(user => new UserDto(user)));
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Post('find')
    async find(@Req() req): Promise<IResponse> {
        try {
            let users = await this.usersService.find(req.body.email) || [];
            return new ResponseSuccess('COMMON.SUCCESS', users.map(user => new UserDto(user)));
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<IResponse> {
        try {
            // console.log("Get user by id", id)
            let user = await this.usersService.findById(id);
            if (!user) {
                return new ResponseError('USER.NOT_FOUND');
            }
            return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user));
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Post('get')
    async findByEmail(@Body() userIDDto: UserIDDto): Promise<IResponse> {
        try {
            let user = await this.usersService.findByUserID(userIDDto.email);
            if (!user) {
                return new ResponseError('USER.NOT_FOUND');
            }
            return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user));
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Get('clear/picture/:id')
    async clearPicture(@Param('id') id: string): Promise<IResponse> {
        try {
            let userDB = await this.usersService.clearPicture(id);
            return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(userDB));
        } catch (error) {
            return new ResponseError('SETTINGS.UPDATE_ERROR', error);
        }
    }

    // @Post('update/picture')
    // @UseInterceptors(FileInterceptor('file'))
    // async updatePicture(@UploadedFile() file, @Body() body: DocumentDto): Promise<IResponse> {
    //     try {
    //         console.log(body)
    //         const document = new SDocumentDto({
    //             ...body,
    //             content: file.buffer,
    //             mimetype: file.mimetype,
    //             fileName: file.originalname
    //         });
            
    //         let userDB = await this.usersService.updatePicture(document, body.id);
    //         return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(userDB));
    //     } catch (error) {
    //         return new ResponseError('SETTINGS.UPDATE_ERROR', error);
    //     }
    // }

    @Post('update/profile')
    async updateSettings(@Body() updateUserSettings: UserSettingsDto): Promise<IResponse> {
        try {
            let user = await this.usersService.updateUserSettings(updateUserSettings);
            return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(user));
        } catch (error) {
            return new ResponseError('SETTINGS.UPDATE_ERROR', error);
        }
    }

    @Post('update/password')
    async updatePassword(@Body() setPassword: SetPasswordDto): Promise<IResponse> {
        try {
            const success = await this.usersService.updatePassword(setPassword);
            if (success) {
                return new ResponseSuccess('PASSWORD.UPDATE_SUCCESS', success);
            } else {
                return new ResponseSuccess('PASSWORD.UPDATE_FAIL', success);
            }
        } catch (error) {
            console.log(error);
            return new ResponseError('PASSWORD.UPDATE_ERROR', error);
        }
    }

}
