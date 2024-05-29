import { Controller, Post, Body, Get, UseInterceptors, UseGuards, UploadedFile } from "@nestjs/common";
import { ResponseSuccess, ResponseError } from "src/common/dto/response.dto";
import { IResponse } from "src/common/interfaces/response.interface";
import { DonationsService } from "./donations.service";
import { AddDonationDTO } from "./dto/add-donation.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/logging.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiBearerAuth()
@Controller('/api/v1/donations')
@ApiTags('Donations')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class DonationsController {

    constructor(private readonly donationsService: DonationsService) { }

    @Get('/')
    @ApiOperation({ summary: 'Return all donations' })
    async findAll(): Promise<IResponse> {
        try {
            let donations = await this.donationsService.findAll();
            return new ResponseSuccess('COMMON.SUCCESS', donations);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a donation' })
    async create(@Body() donation: AddDonationDTO): Promise<IResponse> {
        try {
            let donor = await this.donationsService.create(donation);
            return new ResponseSuccess('COMMON.SUCCESS', donor);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Post('/upload')
    @ApiOperation({ summary: 'Upload donations in batch' })
    @UseInterceptors(FileInterceptor('file'))
    async batchImport(@UploadedFile() file: Express.Multer.File) {
        try {
            let users = this.donationsService.createBatch(file)
            return new ResponseSuccess('COMMON.SUCCESS', users);

        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

}
