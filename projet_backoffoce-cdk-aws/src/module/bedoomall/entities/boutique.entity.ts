import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('boutique')
export class Boutique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  libelle: string;

  @Column({ type: 'varchar' })
  nbre_vente: string;

  @Column({ type: 'varchar', nullable: true })
  latitude?: string;

  @Column({ type: 'varchar', nullable: true })
  longitude?: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  statut: string;

  @Column({ type: 'varchar' })
  tel: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  logo: string;
  user_tel: string;
}
export class updateBoutique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  libelle: string;

  @Column({ type: 'varchar' })
  nbre_vente: string;

  @Column({ type: 'varchar', nullable: true })
  latitude?: string;

  @Column({ type: 'varchar', nullable: true })
  longitude?: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  statut: string;

  @Column({ type: 'varchar' })
  tel: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  logo: string;
  user_id: string;
}