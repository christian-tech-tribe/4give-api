import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Expense } from './entity/expense.entity';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { Campaign } from 'src/campaign/entity/campaign.entity';
import exp from 'constants';

@Injectable()
export class ExpensesService {

    constructor(
        @Inject('EXPENSE_REPOSITORY') private readonly expenseRepository: Repository<Expense>,
        @Inject('CAMPAIGN_REPOSITORY') private readonly campaignRepository: Repository<Campaign>,
    ) { }

    async create(expense: CreateExpenseDTO): Promise<Expense> {
        if (expense.campaignCode) {
            let campaign = await this.campaignRepository.findOne({
                where: {
                    code: expense.campaignCode
                }
            })
            if (!campaign) {
                throw Error("Campaign not found")
            }
            let expenseDB = this.expenseRepository.create({
                campaign: campaign,
                amount: expense.amount,
                currency: expense.currency,
                date: expense.date,
                description: expense.description
            })
            await this.expenseRepository.insert(expenseDB)
            return expenseDB    
        } else {
            let expenseDB = this.expenseRepository.create({
                amount: expense.amount,
                currency: expense.currency,
                date: expense.date,
                description: expense.description
            })
            await this.expenseRepository.insert(expenseDB)
            return expenseDB
        }
    }

    async findAll(): Promise<Expense[]> {
        return await this.expenseRepository.find({
            relations: ["campaign"]
        })
    }
}
