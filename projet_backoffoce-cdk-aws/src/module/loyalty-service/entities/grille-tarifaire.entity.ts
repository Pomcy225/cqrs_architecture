import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('grille_tarifaire')
export class GrilleTarifaire {
  @PrimaryGeneratedColumn()
  id: string;
  
  @Column({ type: 'varchar' })
  date_debut: string;
  @Column({ type: 'varchar' })
  date_fin: string;

  @Column({ type: 'double precision' })
  montant: number;

  @Column({ type: 'int', default: 0 })
  point: number;
}

