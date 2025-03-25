import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('commentaire')
export class Commentaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'boolean' })
  statut: boolean;

  @Column({ type: 'integer' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'integer' })
  place_id: number;

}
