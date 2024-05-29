import { Module } from '@nestjs/common';
import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from 'src/database/database.providers';
import { repositoryProviders } from 'src/database/repository.providers';

@Module({
  controllers: [BankingController],
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...databaseProviders,
    ...repositoryProviders,
    BankingService
  ]
})
export class BankingModule {}
