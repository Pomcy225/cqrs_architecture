import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ville } from './ville.entity';

@Entity('pharmacie')
export class Pharmacie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nom_pharmacien?: string;

  @Column({ type: 'varchar', length: 255 })
  tel1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tel2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tel3?: string;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column({ type: 'double precision' })
  longitude: number;
  @Column({ type: 'integer' })
  ville_id: number;

  @Column({ type: 'timestamp', nullable: true })
  date_debut_garde?: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_fin_garde?: Date;
}
