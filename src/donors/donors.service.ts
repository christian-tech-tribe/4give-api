import { Inject, Injectable } from '@nestjs/common';
import { Donor, DonorStatus, DonorType } from './entity/donor.entity';
import { DonorDTO } from './dto/donor.dto';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { Communication } from './entity/communication.entity';
import { CreateDonorDTO } from './dto/create-donor.dto';
import * as reader from 'xlsx'
import * as moment from 'moment'
import { cleanStringList, getDonorType, getTrueFalse } from 'src/common/utility/utility';

@Injectable()
export class DonorsService {

    constructor(
        @Inject('DONOR_REPOSITORY') private readonly donorRepository: Repository<Donor>,
        @Inject('COMMUNICATION_REPOSITORY') private readonly communicationRepository: Repository<Communication>,
        @Inject('DATA_SOURCE') private dataSource: DataSource,
        private configService: ConfigService,
    ) {
        let self = this
        setTimeout(_ => self._ensurePeople())
    }

    async _ensurePeople() {
        if (await this.donorRepository.count() > 0) {
            return
        }
        this.create({
            name: "Michele Mastrogiovanni",
            address: "Via del forte tiburtino, 160",
        } as DonorDTO)
    }

    // async updateCommunication(communication: CommunicationDto) {
    //     let results = this.communicationRepository.findOneBy({
    //         id: donorId
    //     })
    //     if (!results) {
    //         console.log("Donor not found")
    //         return 
    //     }
    //     this.communicationRepository.upsert({
    //         ...communication
    //     } as Communication)


    async update(donor: DonorDTO): Promise<Donor> {
        await this.donorRepository.update({
            id: donor.id
        }, donor)
        return await this.donorRepository.findOne({
            where: {
                id: donor.id
            }
        })
    }

    async create(donor: CreateDonorDTO): Promise<Donor> {
        let communicationDB = this.communicationRepository.create({})
        await this.communicationRepository.insert(communicationDB)
        let donorDB = this.donorRepository.create({
            ...donor,
            communication: communicationDB
        })
        await this.donorRepository.insert(donorDB)
        return donorDB
    }

    async deleteAll() {
        await this.donorRepository.delete({})
        await this.communicationRepository.delete({})
    }

    async createBatch(document: Express.Multer.File): Promise<Donor[]> {

        const file = reader.read(document.buffer)
        let donors = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            // console.log(file.Sheets[file.SheetNames[i]])
            const rows = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
            for (let row of rows) {
                let donor = {
                    name: cleanStringList([
                        row['Nome'],
                        row['Cognome']
                    ]),
                    address: cleanStringList([
                        row['Nazione'],
                        row['CAP'],
                        row['Citt&agrave;'],
                        row['Indirizzo'],
                        row['N&deg; Civico']
                    ]),
                    email: cleanStringList([row['Email']]),
                    fiscalCode: cleanStringList([row['Codice fiscale']]),
                    vat: cleanStringList([row['Partita iva']]),
                    phone: cleanStringList([row['Tel']]),
                    cellphone: cleanStringList([row['Cell']]),
                    dateOfBirth: cleanStringList([row['Data di nascita']]),
                    placeOfBirth: cleanStringList([row['Luogo di nascita']]),
                    gender: cleanStringList([row['Sesso']]),
                    dateOfCreation: moment().format('YYYY/MM/DD'),
                    donor: getTrueFalse(row['Donatore']),
                    donorType: getDonorType(row['Tipo donatore']),
                    status: DonorStatus.ACTIVE,
                    firstContactSource: cleanStringList([row['Utente ultima modifica']]),
                    updateDate: moment().format('YYYY/MM/DD'),
                    updateEmail: "TODO"
                } as Donor;

                donors.push(donor)
            }

        // 'Data inserimento': 44703.80138888889,

        // 'Comunicazioni email': 'Si',
        // 'Comunicazioni cartacee': 'Si',
        // 'Consenso invio materiale informativo': 'Si',
        // 'Consenso ringraziamenti': 'Si',
        // 'Consenso SMS': 'Si',
        // 'Consenso contatto telefonico': 'Si',

        // 'Mail valida': 'No',
        // 'Almeno una mail': 'No',

        // Stato: 'Attivo',

        // 'Data ultima modifica': '22-05-2022',
        // 'Utente ultima modifica': 'Admin MCR'

        }

        // donors: CreateDonorDTO[]

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let communicationsDB = donors.map(donor => {
                let communicationDB = this.communicationRepository.create({})
                return communicationDB
            })
            await queryRunner.manager.save(communicationsDB);
            // await this.communicationRepository.insert(communicationsDB)
            let donorsDB = []
            for (let i = 0; i < donors.length; i++) {
                donorsDB.push(this.donorRepository.create({
                    ...donors[i],
                    communication: communicationsDB[i]
                }))
            }
            // await this.donorRepository.insert(donorsDB)
            await queryRunner.manager.save(donorsDB);
            await queryRunner.commitTransaction();
            return donorsDB
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
    }

    async findAll(): Promise<Donor[]> {
        return await this.donorRepository.find({
            order: {
                name: "ASC"
            }
        })
    }

    async findById(id: number): Promise<Donor> {
        return await this.donorRepository.findOne({
            where: {
                id
            }
        })
    }

    // async findTest() : Promise<any> {
    //     return await this.donorRepository.manager.query(`select * from donation join donor on donor.id = donation."donorId"`)
    //         // .createQueryBuilder("donor")
    //         // .select("donor.name")
    //         // .addSelect("COUNT(donor.donations)", "donations")
    //         // .groupBy("donor.id")
    //         // .getRawMany()
    // }

}
