import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('categorie')
export class Dispatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  livreur_id: string;

  @Column({ type: 'varchar', length: 255 })
  createdAt: string;

  @Column({ type: 'varchar', length: 255 })
  updatedAt: string;

  @Column({ type: 'varchar', length: 255 })
  commande_carte_id: string;

}


