import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LessThan, MoreThan, Repository, Transaction } from 'typeorm';
import { BankingToken } from './entity/banking-token';

@Injectable()
export class BankingService {

    constructor(
        @Inject('TRANSACTION_REPOSITORY') private readonly transactionRepository: Repository<Transaction>,
        @Inject('BANKING_TOKEN_REPOSITORY') private readonly bankingTokenRepository: Repository<BankingToken>,
        private configService: ConfigService,
    ) { }

    async getToken() : Promise<BankingToken> {
        let tokenDB = await this.bankingTokenRepository.findOne({
            where: {
                accessExpire: MoreThan(new Date())
            },
        })
        if (tokenDB) {
            return tokenDB
        }
        let response = await fetch("https://bankaccountdata.gocardless.com/api/v2/token/new/", {
            method: "post",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                secret_id: this.configService.get<string>("GOCARDLESS_SECRET_ID"),
                secret_key: this.configService.get<string>("GOCARDLESS_SECRET_KEY"),
            })
        })
        // {
        //     "access": "...",
        //     "access_expires": 86400,
        //     "refresh": "...",
        //     "refresh_expires": 2592000
        // }        
        let token = await response.json()
        tokenDB = this.bankingTokenRepository.create({
            accessExpire: new Date(new Date().getTime() + (1000 * token?.access_expires)),
            accessToken: token?.access,
            refreshExpire: new Date(new Date().getTime() + (1000 * token?.refresh_expires)),
            refreshToken: token?.refresh
        })
        await this.bankingTokenRepository.insert(tokenDB)
        return tokenDB
    }

    async findInstitutions(token: string, country: string) {
        let response = await fetch("https://bankaccountdata.gocardless.com/api/v2/institutions/?country=" + country, {
            method: "get",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        let res = await response.json()
        if (res?.status_code === 400) {
            throw Error(res?.country?.detail)
        }
        return res
        // {
        //     "id": "FINECO_FEBIITM2XXX",
        //     "name": "Fineco",
        //     "bic": "FEBIITM2XXX",
        //     "transaction_total_days": "730",
        //     "countries": [
        //       "IT"
        //     ],
        //     "logo": "https://cdn.nordigen.com/ais/FINECO_FEBIITM2XXX.png"
        // },
    }

    async createAgreement(token: string, institution_id: string, days: number, access_days: number) {
        let response = await fetch("https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/", {
            method: "post",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                institution_id,
                max_historical_days: days,
                access_valid_for_days: access_days,
                access_scope: ["balances", "details", "transactions"]
            })
        })
        return await response.json()
        // {
        //     "id": "6460cf27-3c31-4eca-bb3d-836aa5b347ba",
        //     "created": "2023-11-08T22:57:23.669118Z",
        //     "institution_id": "FINECO_FEBIITM2XXX",
        //     "max_historical_days": 730,
        //     "access_valid_for_days": 3,
        //     "access_scope": [
        //         "balances",
        //         "details",
        //         "transactions"
        //     ],
        //     "accepted": null
        // }        
    }

    async createRequisition(token: string, institution_id: string, reference: string, agreement: string) {
        let response = await fetch("https://bankaccountdata.gocardless.com/api/v2/requisitions/", {
            method: "post",
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                redirect: "http://www.yourwebpage.com",
                institution_id: institution_id,
                reference,
                agreement,
                user_language: "IT"
            })
        })
        return await response.json()
        // {
        //     "id": "6ff2b2d5-1efc-4781-9673-8e965a4df5d7",
        //     "created": "2023-11-08T22:58:30.115656Z",
        //     "redirect": "http://www.yourwebpage.com",
        //     "status": "CR",
        //     "institution_id": "FINECO_FEBIITM2XXX",
        //     "agreement": "6460cf27-3c31-4eca-bb3d-836aa5b347ba",
        //     "reference": "124151",
        //     "accounts": [],
        //     "user_language": "IT",
        //     "link": "https://bankaccountdata.gocardless.com/psd2/start/6ff2b2d5-1efc-4781-9673-8e965a4df5d7/FINECO_FEBIITM2XXX",
        //     "ssn": null,
        //     "account_selection": false,
        //     "redirect_immediate": false
        // }        
    }

    async getRequisition(token: string, requisitionId: string) {
        let response = await fetch("https://bankaccountdata.gocardless.com/api/v2/requisitions/" + requisitionId, {
            method: "get",
            headers: {
                'accept': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return await response.json()
        // {
        //     "id": "6ff2b2d5-1efc-4781-9673-8e965a4df5d7",
        //     "created": "2023-11-08T22:58:30.115656Z",
        //     "redirect": "http://www.yourwebpage.com",
        //     "status": "LN",
        //     "institution_id": "FINECO_FEBIITM2XXX",
        //     "agreement": "6460cf27-3c31-4eca-bb3d-836aa5b347ba",
        //     "reference": "124151",
        //     "accounts": [
        //         "6f4bfac3-d5e4-4964-8df6-58a0fb88e59d"
        //     ],
        //     "user_language": "IT",
        //     "link": "https://bankaccountdata.gocardless.com/psd2/start/6ff2b2d5-1efc-4781-9673-8e965a4df5d7/FINECO_FEBIITM2XXX",
        //     "ssn": null,
        //     "account_selection": false,
        //     "redirect_immediate": false
        // }        
    }

    async getTransaction(token: string, accountId: string) {
        let response = await fetch(`https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions/`, {
            method: "get",
            headers: {
                'accept': 'application/json',
                'authorization': 'Bearer ' + token
            }
        })
        return await response.json()
        // {
        //     "transactions": {
        //         "booked": [
        //             {
        //             "transactionId": "MjAyNDA1MTdfMjUwOTgzNTM1MjQwMzY5NzA=",
        //             "bookingDate": "2024-05-17",
        //             "valueDate": "2024-05-17",
        //             "transactionAmount": {
        //                 "amount": "+188.10",
        //                 "currency": "EUR"
        //             },
        //             "creditorName": "MASTROGIOVANNI MICHELE",
        //             "debtorName": "INPS-IT-ROMA-via Ciro il Grande 21",
        //             "remittanceInformationUnstructured": "Data accredito: 17/05/2024 Banca ordinante: BANCA DITALIA Causale: /BENEF/ASSEGNO UNICO PER 3 FIGLI O PER IL PERIODO DA 01-05-2024 A 31-05-2024 - NUMERO PRATICA 79200  . .",
        //             "remittanceInformationStructured": "/BENEF/ASSEGNO UNICO PER 3 FIGLI O PER IL PERIODO DA 01-05-2024 A 31-05-2024 - NUMERO PRATICA 79200  . .",
        //             "proprietaryBankTransactionCode": "I48-Bonifico SEPA Italia",
        //             "internalTransactionId": "ee6a0723504a48fe0bafa504787419c7"
        //             },
        //         },
        //         "pending": [
        //             ...
        //         ]
        //     }
        // }
    }

}
