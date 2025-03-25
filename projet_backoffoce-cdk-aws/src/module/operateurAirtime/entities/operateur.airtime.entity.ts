import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CreateOperateurAirtimeDto } from '../dto/create-operateur.airtime.dto';

@Entity('OperateurAirtime')
export class OperateurAirtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;
  @Column({ type: 'varchar', length: 255 })
  code: string;
  @Column({ type: 'varchar', length: 255 })
  status: string;

  static newInstanceFromDTO(data: CreateOperateurAirtimeDto) {
    const idUnique = Math.floor(Math.random() * 1000);
    const operateur = new OperateurAirtime();
    operateur.id = idUnique;
    operateur.libelle = data.libelle;
    operateur.code = data.code;
    operateur.status = data.status;
    return operateur;
  }
  static newInstanceFormDynamoDBObject(data: any): OperateurAirtime {
    const operateur = new OperateurAirtime();
    operateur.id = data.id.S;
    operateur.libelle = data.libelle.S || '';
    operateur.code = data.code.S || '';
    operateur.status = data.status.S || '';
    return operateur;
  }
}



