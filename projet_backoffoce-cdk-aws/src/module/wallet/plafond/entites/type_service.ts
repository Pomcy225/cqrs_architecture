import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('type_service')
export class TypeService {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  code: string;
  @Column({ type: 'varchar' })
  libelle: string;
}
