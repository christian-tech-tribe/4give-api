import { Donation } from 'src/donations/entity/donation.entity';
import { Expense } from 'src/expenses/entity/expense.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Campaign {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  objectives: string;

  @Column()
  tools: string;

  @Column({ type: "date" })
  begin: Date;

  @Column({ type: "date", nullable: true })
  end: Date;

  @OneToMany(() => Donation, (donation) => donation.campaign)
  donations: Donation[];

  @OneToMany(() => Expense, (expense) => expense.campaign)
  expenses: Expense[];

}