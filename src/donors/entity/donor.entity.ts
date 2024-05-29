import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { Communication } from './communication.entity';
import { Donation } from '../../donations/entity/donation.entity';
import { Note } from 'src/note/entity/note.entity';

export enum DonorStatus {
  ACTIVE,
}

export enum DonorType {
  PERSON,
  ORGANIZATION,
  OTHER
}

@Entity()
export class Donor {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  @Index()
  name: string; // Name Surname

  @Column({ nullable: true })
  address: string; // Nation, Region, City, Province, Street, Number, CAP, ...

  @Column({ nullable: true })
  fiscalCode: string;

  @Column({ nullable: true })
  vat: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  cellphone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  placeOfBirth: string;

  @Column({ nullable: true })
  gender: string // M, F

  @Column({ nullable: true })
  firstContactSource: string // Internet, Phone, Church...

  @Column({ nullable: true })
  dateOfCreation: string;

  @OneToOne(() => Communication)
  @JoinColumn()
  communication: Communication

  // Mail valida	
  @Column({ nullable: true })
  validEmail: boolean;

  // Almeno una mail	
  @Column({ nullable: true })
  atLeastAnEmail: boolean;

  // Donatore
  @Column({ nullable: true })
  donor: boolean;
  
  @Column({ nullable: true })
  donorType: DonorType;

  @Column({ type: "enum", enum: DonorStatus, default: DonorStatus.ACTIVE })
  status: DonorStatus;

  @OneToMany(() => Donation, (donation) => donation.donor)
  donations: Donation[];

  @OneToMany(() => Note, (note) => note.donor)
  notes: Note[];

  @Column({ nullable: true })
  updateDate: string;

  @Column({ nullable: true })
  updateEmail: string;

}