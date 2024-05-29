import { Donation } from 'src/donations/entity/donation.entity';
import { Donor } from 'src/donors/entity/donor.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne, Index } from 'typeorm';

export enum NoteType {
    NOTE,
    ACTION,
}

@Entity()
export class Note {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamptz", default: () => 'NOW()' })
    creation: Date;

    @Column()
    creatorName: string

    @Column()
    creatorEmail: string

    @Column({ type: "timestamptz", nullable: true })
    lastModification: Date;

    @Column({ nullable: true })
    updaterName: string

    @Column({ nullable: true })
    updaterEmail: string

    @Column()
    text: string;

    @Column({ type: "enum", enum: NoteType, default: NoteType.NOTE })
    type: NoteType;

    @ManyToOne(() => Donor, (donor) => donor.notes)
    // @JoinColumn()
    donor: Donor;

}