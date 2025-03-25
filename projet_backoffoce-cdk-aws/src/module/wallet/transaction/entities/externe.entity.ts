import { ChildEntity, Column } from 'typeorm';
import { Transaction } from './transactions.entity';

@ChildEntity('interne') // Type de transaction : "interne"
export class Externe extends Transaction {

  vendorTrxId: string; // Spécifique à la transaction interne

  @Column()
  provider: string;
}
