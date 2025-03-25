import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  service_code: string;

  @Column({ type: 'varchar', length: 255 })
  service_nom: string;

  @Column({ type: 'varchar', length: 255 })
  type_transaction: string;

  @Column({ type: 'timestamp' })
  date_transaction: Date;

  @Column({ type: 'double precision' })
  montant: number;
  @Column({ type: 'varchar', length: 255 })
  account_id: string;
}
