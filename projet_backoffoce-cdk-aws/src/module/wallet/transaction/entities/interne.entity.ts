import { ChildEntity, Column } from 'typeorm';
import { Transaction } from './transactions.entity';

@ChildEntity('interne') // Type de transaction : "interne"
export class Interne extends Transaction {

}
