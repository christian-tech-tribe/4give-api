import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Communication {

  @PrimaryGeneratedColumn()
  id: number

  // Comunicazioni email	
  @Column({ default: false })
  email: boolean;

  // Comunicazioni cartacee	
  @Column({ default: false })
  paper: boolean;

  // Consenso invio materiale informativo	
  @Column({ default: false })
  informativeMaterial: boolean;

  // Consenso ringraziamenti	
  @Column({ default: false })
  thanks: boolean;

  // Consenso SMS	
  @Column({ default: false })
  sms: boolean;

  // Consenso contatto telefonico	
  @Column({ default: false })
  phone: boolean;

}
