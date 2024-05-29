import { Inject, Injectable } from '@nestjs/common';
import { Donor } from '../donors/entity/donor.entity';
import { DataSource, Repository } from 'typeorm';
import { Donation, DonationMode } from './entity/donation.entity';
import { AddDonationDTO } from './dto/add-donation.dto';
import { Campaign } from '../campaign/entity/campaign.entity';
import * as reader from 'xlsx'
import { cleanNumber, cleanStringList } from 'src/common/utility/utility';

@Injectable()
export class DonationsService {

    constructor(
        @Inject('DONOR_REPOSITORY') private readonly donorRepository: Repository<Donor>,
        @Inject('CAMPAIGN_REPOSITORY') private readonly campaignRepository: Repository<Campaign>,
        @Inject('DONATION_REPOSITORY') private readonly donationRepository: Repository<Donation>,
        @Inject('DATA_SOURCE') private dataSource: DataSource,
    ) {}

    async create(donation: AddDonationDTO): Promise<Donation> {
        let campaignDB = null
        if (donation.idCampaign) {
            campaignDB = await this.campaignRepository.findOne({
                where: {
                    id: donation.idCampaign
                }
            })
            if (!campaignDB) {
                throw Error("Campaign not found")
            }
        }
        let donorDB = await this.donorRepository.findOne({
            where: {
                id: donation.idDonor
            }
        })
        if (!donorDB) {
            throw Error("Donor not found")
        }
        let donationDB = this.donationRepository.create({
            amount: donation.amount,
            campaign: campaignDB,
            currency: donation.currency,
            donor: donorDB,
            mode: donation.mode,
            paymentDate: donation.paymentDate,
            paymentRegistrationDate: new Date(),
            receiptSent: false,
            thanksSent: false
        })
        if (campaignDB) {
            donationDB.campaign = campaignDB
        }
        await this.donationRepository.insert(donationDB)
        return donationDB
    }

    async findAll() : Promise<Donation[]> {
        return this.donationRepository.find({
            relations: ["donor", "campaign"]
        })

    }

    async createBatch(document: Express.Multer.File): Promise<Donation[]> {

        const file = reader.read(document.buffer)
        let donations = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const rows = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
            for (let row of rows) {

                let donorDB = await this.donorRepository.findOne({
                    where: {
                        fiscalCode: cleanStringList(row["Codice Fiscale"]),
                    }
                })
                if (!donorDB) {
                    throw Error("Donor not found: " + cleanStringList(row["Codice Fiscale"]))
                }

                let donation = {
                    amount: cleanNumber(row["Valore"]),
                    currency: cleanStringList(row["Valuta"]),
                    mode: DonationMode.OTHER,
                    paymentDate: null,
                    paymentRegistrationDate: new Date(),
                    receiptSent: null,
                    thanksSent: null,
                    donor: donorDB,
                } as Donation

                let campaignDB = await this.campaignRepository.findOne({
                    where: {
                        code: cleanStringList(row["Campagna"]),
                    }
                })
                if (campaignDB) {
                    donation.campaign = campaignDB
                }

                donations.push(donation)
            }

        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(donations);
            await queryRunner.commitTransaction();
            return donations
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

}
