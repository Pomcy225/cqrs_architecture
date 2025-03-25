import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categorie')
export class Categorie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string;
}
