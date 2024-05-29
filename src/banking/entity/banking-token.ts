import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BankingToken {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    accessToken: string;

    @Column({ type: "timestamptz" })
    accessExpire: Date;

    @Column()
    refreshToken: string;

    @Column({ type: "timestamptz" })
    refreshExpire: Date;

}