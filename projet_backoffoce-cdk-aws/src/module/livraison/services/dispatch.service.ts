import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateDispatchDto } from '../dto/create-dispatch.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class DispatchService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT
     d.id as dispatch_id,
     l.id as livreur_id,
     c.id as commande_id,
     l.nom as livreur_nom,
     l.prenoms as livreur_prenoms,
     l.telephone as livreur_telephone,
     c.date_commande,
     c.type_carte,
     c.couleur,
     c.nom_livreur as commande_nom_livreur,
     c.date_remise_carte as commande_date_remise_carte,
     c.commentaire as commande_commentaire,
     c.tel_client,
     c.nom_client,
     c.lieu_livraison
     FROM dispatch d inner join livreur as l on l.id = d.livreur_id inner join commande_carte as c on c.id = d.commande_carte_id ORDER BY id DESC`;
    const data = await this.dbUtil.endUserServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      livreur: {
        id: row.livreur_id,
        nom: row.livreur_nom,
        prenoms: row.livreur_prenoms,
        telephone: row.livreur_telephone,
      },
      commande: {
        id: row.commande_id,
        date_commande: row.date_commande,
        type_carte: row.type_carte,
        couleur: row.couleur,
        tel_client: row.tel_client,
        nom_client: row.nom_client,
        lieu_livraison: row.lieu_livraison,
        commande_nom_livreur: row.commande_nom_livreur,
        commande_date_remise_carte: row.commande_date_remise_carte,
        commande_commentaire: row.commande_commentaire,
      },
    }));

    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
    // Appliquer la pagination
  }
  async findAllByLivreur(paginationDto: PaginationDto, livreur_id: string) {
    const { page, limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT 
         d.id as id,
     l.id as livreur_id,
     c.id as commande_id,
     l.nom as livreur_nom,
     l.prenoms as livreur_prenoms,
     l.telephone as livreur_telephone,
     c.date_commande,
     c.nom_livreur as nom_livreur,
     c.date_livraison as date_livraison,
     c.type_carte,
     c.couleur,
     c.tel_client,
     c.nom_client,
     c.lieu_livraison
    FROM dispatch d inner join livreur as l on l.id = d.livreur_id inner join commande_carte as c on c.id = d.commande_carte_id where livreur_id = $1 ORDER BY id DESC`;
    const params = [livreur_id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      livreur: {
        id: row.livreur_id,
        nom: row.livreur_nom,
        prenoms: row.livreur_prenoms,
        telephone: row.livreur_telephone,
      },
      commande: {
        id: row.commande_id,
        date_commande: row.date_commande,
        type_carte: row.type_carte,
        couleur: row.couleur,
        tel_client: row.tel_client,
        nom_client: row.nom_client,
        lieu_livraison: row.lieu_livraison,
        nom_livreur: row.nom_livreur,
        date_livraison: row.date_livraison,
      },
    }));

    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
    // Appliquer la pagination
  }
  async create(dispatch: CreateDispatchDto): Promise<any> {
    const now = new Date();

    // Construire une liste de promesses pour insérer chaque commande individuellement
    const insertPromises = dispatch.commande_carte_id.map(
      async (commandeId) => {
        const query = `INSERT INTO dispatch (livreur_id, commande_carte_id, createdAt, updatedAt) 
                       VALUES ($1, $2, $3, $4) RETURNING *`;

        const params = [
          dispatch.livreur_id,
          commandeId, 
          now,
          now,
        ];

        return this.dbUtil.endUserServiceQuery(query, params);
      },
    );

    // Attendre que toutes les insertions soient terminées
    const results = await Promise.all(insertPromises);

    // Retourner toutes les lignes insérées
    return results.map((result) => result.rows[0]);
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM dispatch WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, livreur: CreateDispatchDto): Promise<any> {
    const query = `UPDATE livreur 
                   SET livreur_id = $1, commande_carte_ids = $2, updatedAt = $3 
                   WHERE id = $4 
                   RETURNING *`;
    const now = new Date();
    const params = [
      livreur.livreur_id,
      JSON.stringify(livreur.commande_carte_id),
      now,
      id,
    ];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }

  async delete(id: number): Promise<any> {
    const query = `DELETE FROM dispatch WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
}
