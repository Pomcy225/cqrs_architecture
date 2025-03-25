import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('plafond')
export class Plafond {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double', length: 255 })
  montant: number;

  @Column({ type: 'varchar', length: 255 })
  type_plafond: string;

  @Column({ type: 'integer', length: 255 })
  provider_id: number;

  @Column({ type: 'integer', length: 255 })
  type_service_id: number;

  @Column({ type: 'integer', length: 255 })
  type_action_id: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp' })
  deletedAt: Date;
}
