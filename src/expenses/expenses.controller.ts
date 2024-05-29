import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ExpensesService } from './expenses.service';
import { CreateCampaignDTO } from 'src/campaign/dto/create-campaign.dto';
import { ResponseSuccess, ResponseError } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateExpenseDTO } from './dto/create-expense.dto';

@Controller("/api/v1/expense")
@ApiTags('Campaign')
@UseInterceptors(LoggingInterceptor)
@UseGuards(JwtAuthGuard)
export class ExpensesController {
    
    constructor(private readonly expenseService: ExpensesService) { }

    @Post('/')
    async create(@Body() createExpenseDTO: CreateExpenseDTO): Promise<IResponse> {
        try {
            console.log(createExpenseDTO)
            let expense = await this.expenseService.create(createExpenseDTO);
            return new ResponseSuccess('COMMON.SUCCESS', expense);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }

    @Get('/')
    async findAll(): Promise<IResponse> {
        try {
            let response = await this.expenseService.findAll();
            return new ResponseSuccess('COMMON.SUCCESS', response);
        } catch (error) {
            return new ResponseError('COMMON.ERROR.GENERIC_ERROR', error);
        }
    }


}
