import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { repositoryProviders } from 'src/database/repository.providers';

@Module({
  controllers: [ExpensesController],
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...repositoryProviders,
    ExpensesService
  ]
})
export class ExpensesModule {}
