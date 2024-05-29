import { Module } from '@nestjs/common';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { repositoryProviders } from '../database/repository.providers';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [DonorsController],
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...repositoryProviders,
    DonorsService,
  ]
})
export class DonorsModule {}
