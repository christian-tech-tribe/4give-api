import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DonorsModule } from './donors/donors.module';
import { DatabaseModule } from './database/database.module';
import { CampaignModule } from './campaign/campaign.module';
import { DonationsModule } from './donations/donations.module';
import { NoteModule } from './note/note.module';
import { BankingModule } from './banking/banking.module';
import { ExpensesModule } from './expenses/expenses.module';

import * as dotenv from 'dotenv';
dotenv.config();

function getMongoURL() {
  if (process.env.DB_PROTOCOL == "mongodb+srv") {
    return `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  } else {
    return `${process.env.DB_PROTOCOL}://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&readPreference=primary&appname=Flow%20API&ssl=false`;
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getMongoURL()),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DonorsModule,
    CampaignModule,
    DonationsModule,
    NoteModule,
    BankingModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
