import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CreateOperateurMobileMoneyDto } from '../dto/create-operateur.mobile.money.dto';

@Entity('OperateurMobileMoney')
export class OperateurMobileMoney {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  libelle: string;
  @Column({ type: 'varchar', length: 255 })
  code: string;
  @Column({ type: 'varchar', length: 255 })
  status: string;

  static newInstanceFromDTO(data: CreateOperateurMobileMoneyDto) {
    const idUnique = Math.floor(Math.random() * 1000);
    const operateur = new OperateurMobileMoney();
    operateur.id = idUnique;
    operateur.libelle = data.libelle;
    operateur.code = data.code;
    operateur.status = data.status;
    return operateur;
  }
  static newInstanceFormDynamoDBObject(data: any): OperateurMobileMoney {
    const operateur = new OperateurMobileMoney();
    operateur.id = data.id.S;
    operateur.libelle = data.libelle.S || '';
    operateur.code = data.code.S || '';
    operateur.status = data.status.S || '';
    return operateur;
  }
}
