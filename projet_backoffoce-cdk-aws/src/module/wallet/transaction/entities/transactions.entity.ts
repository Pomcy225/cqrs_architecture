import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    TableInheritance,
  } from 'typeorm';
  
  @Entity('transactions') // Nom de la table mère
  @TableInheritance({ column: { type: 'varchar', name: 'type' } }) // Héritage basé sur une colonne 'type'
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('double')
    montant: number;
  
    @Column('double')
    frais: number;
  
    @Column({ type: 'varchar', length: 50 })
    status: string;
  
    @Column()
    date: string;
  
    @Column({ type: 'varchar', length: 10 })
    devise: string;
  
    @Column()
    libelle: string;
  
    @Column('double')
    newSolde: number;
  
    @Column('double')
    oldSolde: number;
  
    @Column()
    serviceName: string;

    @Column()
    type: string;
  }
  