import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conversion')
export class Conversion {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int', default: 0 })
  point_min: number;

  @Column({ type: 'int', nullable: true })
  point_max: number;

  @Column({ type: 'double precision' })
  montant: number;
}

