import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { Donor } from '../donors/entity/donor.entity';
import { Donation } from '../donations/entity/donation.entity';
import { Communication } from '../donors/entity/communication.entity';
import { Campaign } from '../campaign/entity/campaign.entity';

import * as dotenv from 'dotenv';
import { Note } from 'src/note/entity/note.entity';
import { Expense } from 'src/expenses/entity/expense.entity';
import { BankingToken } from 'src/banking/entity/banking-token';

dotenv.config();

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: process.env.PG_DB_HOST || "localhost",
                port: parseInt(process.env.PG_DB_PORT || "5432"),
                username: process.env.PG_DB_USER,
                password: process.env.PG_DB_PASS,
                database: process.env.PG_DB_NAME,
                // entities: [
                //     Donor, Donation, Communication, 
                //     Campaign, Note, Expense, 
                //     BankingToken
                // ],
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];