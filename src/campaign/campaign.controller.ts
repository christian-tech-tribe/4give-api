import { Controller, Post, Body, Put, Get, UseGuards, UseInterceptors, Param } from "@nestjs/common";
import { ResponseSuccess, ResponseError } from "src/common/dto/response.dto";
import { IResponse } from "src/common/interfaces/response.interface";
import { CampaignService } from "./campaign.service";
import { CreateCampaignDTO } from "./dto/create-campaign.dto";
import { CloseCampaignDTO } from "./dto/close-campaign.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { LoggingInterceptor } from "src/common/interceptors/logging.interceptor";
import { UpdateCampaignDTO } from "./dto/update-campaign.dto";

@ApiBearerAuth()
@Controller("/api/v1/campaign")
@ApiTags('Campaign')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class CampaignController {

    constructor(private readonly campaignService: CampaignService) { }

    @Get('/')
    async findAll(): Promise<IResponse> {
        try {
            let response = await this.campaignService.findAll();
            return new ResponseSuccess('COMMON.SUCCESS', response);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Get('/summary')
    async getSummary(): Promise<IResponse> {
        try {
            let response = await this.campaignService.getSummary();
            return new ResponseSuccess('COMMON.SUCCESS', response);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Post('/')
    async create(@Body() createCampaignDTO: CreateCampaignDTO): Promise<IResponse> {
        try {
            let campaign = await this.campaignService.create(createCampaignDTO);
            return new ResponseSuccess('COMMON.SUCCESS', campaign);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Put('/')
    async update(@Body() updateCampaign: UpdateCampaignDTO): Promise<IResponse> {
        try {
            await this.campaignService.update(updateCampaign);
            return new ResponseSuccess('COMMON.SUCCESS');
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Put('/close')
    async close(@Body() closeCampaign: CloseCampaignDTO): Promise<IResponse> {
        try {
            let campaign = await this.campaignService.close(closeCampaign.id);
            return new ResponseSuccess('COMMON.SUCCESS', campaign);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Get('/donations')
    async getTotDonationCampaign() {
        try {
            let result = await this.campaignService.getTotDonationCampaign();
            return new ResponseSuccess('COMMON.SUCCESS', result);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

    @Get('/expenses')
    async getTotExpenseCampaign() {
        try {
            let result = await this.campaignService.getTotExpenseCampaign();
            return new ResponseSuccess('COMMON.SUCCESS', result);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error?.message);
        }
    }

}