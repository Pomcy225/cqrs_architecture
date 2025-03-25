import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('type_action')
export class TypeAction {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  code: string;
  @Column({ type: 'varchar' })
  libelle: string;
}
