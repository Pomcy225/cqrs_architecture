import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from './place.entity';

@Entity('horaire')
export class Horaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  jour: string;

  @Column({ type: 'integer' })
  jourNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  debutPause?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  finPause?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fin?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  debut?: string;

    @Column({ type: 'integer' })
  place_id: number;
 
}
  