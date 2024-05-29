import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    transactionId: string;

    @Column()
    bookingDate: string;

    @Column()
    valueDate: string;

    @Column()
    transactionAmount: string

    @Column()
    transactionCurrency: string

    @Column()
    creditorName: string

    @Column()
    debtorName: string

    @Column()
    remittanceInformationUnstructured: string

    @Column()
    remittanceInformationStructured: string

    @Column()
    proprietaryBankTransactionCode: string

    @Column()
    internalTransactionId: string

}