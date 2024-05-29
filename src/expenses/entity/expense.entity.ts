import { Campaign } from 'src/campaign/entity/campaign.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Expense {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number

  @Column()
  currency: string;

  @Column()
  description: string;

  @Column({ type: "date" })
  date: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.expenses)
  @JoinColumn()
  campaign: Campaign

}