import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class BankAgreement {

    @PrimaryColumn()
    id: string;

    @Column()
    institution_id: string;

    @Column()
    days: number;

    @Column()
    access_days: number;

    // Unique identifier for reference
    @Column()
    reference: string

}