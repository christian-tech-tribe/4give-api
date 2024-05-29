import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { repositoryProviders } from '../database/repository.providers';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { databaseProviders } from 'src/database/database.providers';

@Module({
    controllers: [CampaignController],
    imports: [DatabaseModule, ConfigModule],
    providers: [
        ...databaseProviders,
        ...repositoryProviders,
        CampaignService
    ]
})
export class CampaignModule {}
