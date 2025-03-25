import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Place } from './place.entity';
import { join } from 'path';


@Entity('lien')
export class Lien {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'varchar', length: 255 })
  social_url: string;

  @Column({ type: 'integer', length: 255 })
  place_id: string;
}
