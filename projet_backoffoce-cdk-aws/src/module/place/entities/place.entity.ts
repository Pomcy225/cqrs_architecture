import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categorie } from './categorie.entity';

@Entity('place')
export class Place {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'varchar', length: 255 })
  description_place: string;

  @Column({ type: 'varchar', length: 255 })
  addresse: string;

  @Column({ type: 'varchar', length: 255 })
  latitude: string;

  @Column({ type: 'varchar', length: 255 })
  longitude: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 255 })
  statut: string;

  @Column({ type: 'varchar', length: 255 })
  tel1: string;

  @Column({ type: 'varchar', length: 255 })
  tel2: string;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;
  @Column()
  categorie_id: number;
}
