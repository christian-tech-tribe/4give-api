import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { BankingService } from './banking.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess, ResponseError } from 'src/common/dto/response.dto';

@ApiBearerAuth()
@Controller("/api/v1/banking")
@ApiTags('Banking')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class BankingController {

    constructor(private readonly bankingService: BankingService) { }

    @ApiOperation({ summary: 'Get list of istitution per country' })
    @Get('/institutions/:country')
    async findInstitutions(@Param("country") country: string): Promise<IResponse> {
        try {
            let token = await this.bankingService.getToken()
            let institutions = await this.bankingService.findInstitutions(token.accessToken, country);
            return new ResponseSuccess('COMMON.SUCCESS', institutions);
        } catch (error) {
            console.log(error)
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }



}
