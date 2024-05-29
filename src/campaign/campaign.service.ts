import { Inject, Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { CreateCampaignDTO } from './dto/create-campaign.dto';
import { Campaign } from './entity/campaign.entity';
import { UpdateCampaignDTO } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {

    constructor(
        @Inject('CAMPAIGN_REPOSITORY') private readonly campaignRepository: Repository<Campaign>,
    ) { }

    async findAll(): Promise<any> {
        return await this.campaignRepository.find({
            // where: {
            //     begin: LessThan(new Date("2018-11-15  10:41:30.746877"))
            // },
            relations: ["donations", "expenses"]
        })
    }

    async getSummary(): Promise<any> {
        return await this.campaignRepository.query(`
            select
                c."id" as id,
                c."code" as code,
                c."title" as title,
                c."objectives" as objectives,
                c."tools" as tools,
                sum(d.amount) as total_donation,
                sum(e.amount) as total_expense
            from campaign c
            left join donation d 
            on d."campaignId" = c.id
            left join expense e 
            on e."campaignId" = c.id
            group by 
                c."id", 
                c."code", 
                c."title", 
                c."objectives", 
                c."tools"
        `)
    }

    async getTotDonationCampaign() {
        return await this.campaignRepository.query(`
            select
                d."campaignId",
                sum(amount) as amount,
                currency 
            from donation d 
            group by d."campaignId", currency
        `)
    }

    async getTotExpenseCampaign() {
        return await this.campaignRepository.query(`
            select
                e."campaignId",
                sum(amount) as amount,
                currency 
            from expense e 
            group by e."campaignId", currency
        `)
    }

    async create(campaign: CreateCampaignDTO): Promise<Campaign> {
        let campaignDB = this.campaignRepository.create({
            code: campaign.code,
            title: campaign.title,
            objectives: campaign.objectives,
            tools: campaign.tools,
            begin: new Date(),
        })
        await this.campaignRepository.insert(campaignDB)
        return campaignDB
    }

    async close(idCampaign: number) {
        let campaign = await this.campaignRepository.findOne({
            where: {
                id: idCampaign
            }
        })
        if (!campaign) {
            throw Error("Campaign not found")
        }
        if (campaign.end) {
            throw Error("Campaign already closed")
        }
        campaign.end = new Date()
        await this.campaignRepository.save(campaign)
        return campaign
    }

    async update(updateCampaign: UpdateCampaignDTO) {
        await this.campaignRepository.update({
            id: updateCampaign.id
        }, {
            title: updateCampaign.title,
            objectives: updateCampaign.objectives,
            tools: updateCampaign.tools
        })
    }
}
