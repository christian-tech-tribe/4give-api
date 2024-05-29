import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { repositoryProviders } from '../database/repository.providers';

@Module({
  controllers: [DonationsController],
  imports: [DatabaseModule, ConfigModule],
  providers: [
    ...repositoryProviders,
    DonationsService
  ]
})
export class DonationsModule {}
