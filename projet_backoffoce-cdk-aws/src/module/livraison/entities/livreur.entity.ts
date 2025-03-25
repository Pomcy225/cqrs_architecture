import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('categorie')
export class Livreur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  prenoms: string;

  @Column({ type: 'varchar', length: 255 })
  createdAt: string;

  @Column({ type: 'varchar', length: 255 })
  updatedAt: string;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'varchar', length: 255 })
  telephone: string;

  @Column({ type: 'varchar', length: 255 })
  compte: string;

}
