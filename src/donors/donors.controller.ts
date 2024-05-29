import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { DonorDTO } from './dto/donor.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDonorDTO } from './dto/create-donor.dto';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@Controller('/api/v1/donors')
@ApiTags('Donors')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class DonorsController {

    constructor(private readonly donorsService: DonorsService) { }

    @Get('/')
    async findAll(): Promise<IResponse> {
        try {
            let users = await this.donorsService.findAll();
            return new ResponseSuccess('COMMON.SUCCESS', users);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Get('/:id')
    async findById(@Param('id') id: number): Promise<IResponse> {
        try {
            let donor = await this.donorsService.findById(id);
            return new ResponseSuccess('COMMON.SUCCESS', donor);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Post('/')
    async create(@Body() donorDTO: CreateDonorDTO): Promise<IResponse> {
        try {
            let donor = await this.donorsService.create(donorDTO);
            return new ResponseSuccess('COMMON.SUCCESS', donor);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Put('/')
    async update(@Body() donorDTO: DonorDTO): Promise<IResponse> {
        try {
            let donor = await this.donorsService.update(donorDTO);
            return new ResponseSuccess('COMMON.SUCCESS', donor);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    // @Post('/test')
    // async test(): Promise<IResponse> {
    //     try {
    //         return await this.donorsService.findTest()
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    // @Delete('/')
    // async deleteAll(): Promise<IResponse> {
    //     try {
    //         await this.donorsService.deleteAll();
    //         return new ResponseSuccess('COMMON.SUCCESS');
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async batchImport(@UploadedFile() file: Express.Multer.File) {
        try {
            let users = this.donorsService.createBatch(file)
            return new ResponseSuccess('COMMON.SUCCESS', users);

        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    // @Post('/all')
    // async findAll(@Req() req): Promise<IResponse> {
    //     try {
    //         let users = await this.usersService.findAll() || [];
    //         return new ResponseSuccess('COMMON.SUCCESS', users.map(user => new UserDto(user)));
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    // @Post('find')
    // async find(@Req() req): Promise<IResponse> {
    //     try {
    //         let users = await this.usersService.find(req.body.email) || [];
    //         return new ResponseSuccess('COMMON.SUCCESS', users.map(user => new UserDto(user)));
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    // @Get(':id')
    // async findById(@Param('id') id: string): Promise<IResponse> {
    //     try {
    //         // console.log("Get user by id", id)
    //         let user = await this.usersService.findById(id);
    //         if (!user) {
    //             return new ResponseError('USER.NOT_FOUND');
    //         }
    //         return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user));
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    // @Post('get')
    // async findByUserId(@Body() userIDDto: UserIDDto): Promise<IResponse> {
    //     try {
    //         let user = await this.usersService.findByUserID(userIDDto);
    //         if (!user) {
    //             return new ResponseError('USER.NOT_FOUND');
    //         }
    //         return new ResponseSuccess('COMMON.SUCCESS', new UserDto(user));
    //     } catch (error) {
    //         return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
    //     }
    // }

    // @Get('clear/picture/:id')
    // async clearPicture(@Param('id') id: string): Promise<IResponse> {
    //     try {
    //         let userDB = await this.usersService.clearPicture(id);
    //         return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(userDB));
    //     } catch (error) {
    //         return new ResponseError('SETTINGS.UPDATE_ERROR', error);
    //     }
    // }

    // // @Post('update/picture')
    // // @UseInterceptors(FileInterceptor('file'))
    // // async updatePicture(@UploadedFile() file, @Body() body: DocumentDto): Promise<IResponse> {
    // //     try {
    // //         console.log(body)
    // //         const document = new SDocumentDto({
    // //             ...body,
    // //             content: file.buffer,
    // //             mimetype: file.mimetype,
    // //             fileName: file.originalname
    // //         });

    // //         let userDB = await this.usersService.updatePicture(document, body.id);
    // //         return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(userDB));
    // //     } catch (error) {
    // //         return new ResponseError('SETTINGS.UPDATE_ERROR', error);
    // //     }
    // // }

    // @Post('update/profile')
    // async updateSettings(@Body() updateUserSettings: UserSettingsDto): Promise<IResponse> {
    //     try {
    //         let user = await this.usersService.updateUserSettings(updateUserSettings);
    //         return new ResponseSuccess('PROFILE.UPDATE_SUCCESS', new UserDto(user));
    //     } catch (error) {
    //         return new ResponseError('SETTINGS.UPDATE_ERROR', error);
    //     }
    // }

    // @Post('update/password')
    // async updatePassword(@Body() setPassword: SetPasswordDto): Promise<IResponse> {
    //     try {
    //         const success = await this.usersService.updatePassword(setPassword);
    //         if (success) {
    //             return new ResponseSuccess('PASSWORD.UPDATE_SUCCESS', success);
    //         } else {
    //             return new ResponseSuccess('PASSWORD.UPDATE_FAIL', success);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return new ResponseError('PASSWORD.UPDATE_ERROR', error);
    //     }
    // }

}
