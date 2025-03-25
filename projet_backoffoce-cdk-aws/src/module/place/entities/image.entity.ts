import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @Column({ type: 'integer' })
  place_id: number;
}
