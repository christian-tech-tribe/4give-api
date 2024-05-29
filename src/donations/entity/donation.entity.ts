import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Donor } from '../../donors/entity/donor.entity';
import { Campaign } from '../../campaign/entity/campaign.entity';

export enum DonationMode {
  BONIFICO = 'BONIFICO',
  CONTANTI = 'CONTANTI',
  PAYPAL = 'PAYPAL',
  OTHER = 'OTHER',
}

@Entity()
export class Donation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Donor, (donor) => donor.donations)
  @JoinColumn()
  donor: Donor;

  @Column({ type: "date" })
  paymentDate: Date;

  @Column({ type: "date", default: () => 'NOW()' })
  paymentRegistrationDate: Date;

  // @Column({ nullable: true })
  // acceptanceDate: string;

  @Column()
  amount: number

  @Column()
  currency: string;

  // @Column({ nullable: true })
  // status: string

  @Column({ type: "enum", enum: DonationMode, default: DonationMode.OTHER })
  mode: DonationMode

  @Column({ nullable: true, default: false })
  receiptSent: boolean;

  @Column({ nullable: true, default: false })
  thanksSent: boolean

  @ManyToOne(() => Campaign, (campaign) => campaign.donations)
  @JoinColumn()
  campaign: Campaign;

}