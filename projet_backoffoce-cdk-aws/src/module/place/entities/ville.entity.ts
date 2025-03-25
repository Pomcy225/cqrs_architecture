import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pharmacie } from './pharmacie.entity';


@Entity('ville')
export class Ville {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

}
