import { v4 as uuidv4 } from 'uuid';
import { CreateTicketDto } from '../dto/create-ticket.dto';
export class Tickete {
  id: string;
  libelle?: string;
  description?: string;
  transaction_id?: string;
  created_at: string;

  priorite?: string;

  type_reclamation?: string;
  numero?: string;
  nom?: string;
  prenom?: string;

  static newInstanceFromDTO(data: CreateTicketDto) {
    const idUid4 = uuidv4();
    const res = new Tickete();
    res.id = idUid4;
    res.libelle = data.libelle;
    res.description = data.description;
    res.transaction_id = data.transaction_id;
    res.priorite = data.priorite;
    res.type_reclamation = data.type_reclamation;
    res.numero = data.numero;
    res.nom = data.nom;
    res.prenom = data.prenom;
    res.created_at = new Date().toISOString();
    return res;
  }

  static newInstanceFromDynamoDBObject(data: any): Tickete {
    const res = new Tickete();
    res.id = data.id.S;
    res.libelle = data.libelle?.S;
    res.description = data.description?.S || '';
    res.transaction_id = data.transaction_id?.S || '';
    res.priorite = data.priorite?.S || '';
    res.type_reclamation = data.type_reclamation?.S || '';
    res.numero = data.numero?.S || '';
    res.nom = data.nom?.S || '';
    res.prenom = data.prenom?.S || '';
    res.created_at = data.created_at.S;

    return res;
  }

  static newInstanceFormDynamoDBObject(data: any): Tickete {
    const res = new Tickete();
    res.id = data.id.S;
    res.libelle = data.libelle?.S;
    res.description = data.description?.S || '';
    res.transaction_id = data.transaction_id?.S || '';
    res.priorite = data.priorite?.S || '';
    res.type_reclamation = data.type_reclamation?.S || '';
    res.numero = data.numero?.S || '';
    res.nom = data.nom?.S || '';
    res.prenom = data.prenom?.S || '';
    res.created_at = data.created_at.S;
    return res;
  }
}
