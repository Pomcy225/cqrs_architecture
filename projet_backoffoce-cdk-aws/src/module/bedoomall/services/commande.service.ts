import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class CommandeService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer toutes les commandes avec pagination
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const query = `
      SELECT c.*, b.libelle AS boutique_name, b.nbre_vente, b.latitude AS boutique_latitude, 
             b.longitude AS boutique_longitude, b.createdAt AS boutique_createdAt, 
             b.statut AS boutique_statut, b.tel AS boutique_tel, b.email AS boutique_email, 
             b.logo AS boutique_logo
      FROM commande c
      JOIN boutique b ON c.boutique_id = b.id
      ORDER BY c.id DESC
    `;

    try {
      const data = await this.dbUtil.bedooMallServiceQuery(query);

      const formattedData = data.rows.map((row) => ({
        id: row.id,
        numero_commande: row.numero_commande,
        date_commande: row.date_commande,
        quantite: row.quantite,
        montant: row.montant,
        latitude_livraison: row.latitude_livraison,
        longitude_livraison: row.longitude_livraison,
        boutique: {
          id: row.boutique_id,
          libelle: row.boutique_name,
          nbre_vente: row.nbre_vente,
          latitude: row.boutique_latitude,
          longitude: row.boutique_longitude,
          createdAt: row.boutique_createdAt,
          statut: row.boutique_statut,
          tel: row.boutique_tel,
          email: row.boutique_email,
          logo: row.boutique_logo,
        },
      }));

      return paginate(formattedData, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch commandes',
        error.message,
      );
    }
  }

  // Récupérer une commande et ses éléments par ID
  async getOne(id: number): Promise<any> {
    const commandeQuery = `
      SELECT c.*, b.libelle AS boutique_name, b.nbre_vente, b.latitude AS boutique_latitude, 
             b.longitude AS boutique_longitude, b.createdAt AS boutique_createdAt, 
             b.statut AS boutique_statut, b.tel AS boutique_tel, b.email AS boutique_email, 
             b.logo AS boutique_logo
      FROM commande c
      JOIN boutique b ON c.boutique_id = b.id
      WHERE c.id = $1
    `;

    const elementsQuery = `
      SELECT e.* 
      FROM ligne_commande e
      WHERE e.commande_id = $1
    `;

    try {
      // Récupérer la commande
      const commandeResult = await this.dbUtil.bedooMallServiceQuery(
        commandeQuery,
        [id],
      );
      if (commandeResult.rows.length === 0) {
        throw new NotFoundException(`Commande with ID ${id} not found`);
      }

      // Récupérer les éléments associés
      const elementsResult = await this.dbUtil.bedooMallServiceQuery(
        elementsQuery,
        [id],
      );

      // Retourner la commande avec ses éléments
      return {
        id: commandeResult.rows[0].id,
        numero_commande: commandeResult.rows[0].numero_commande,
        date_commande: commandeResult.rows[0].date_commande,
        quantite: commandeResult.rows[0].quantite,
        montant: commandeResult.rows[0].montant,
        latitude_livraison: commandeResult.rows[0].latitude_livraison,
        longitude_livraison: commandeResult.rows[0].longitude_livraison,
        boutique: {
          id: commandeResult.rows[0].boutique_id,
          libelle: commandeResult.rows[0].boutique_name,
          nbre_vente: commandeResult.rows[0].nbre_vente,
          latitude: commandeResult.rows[0].boutique_latitude,
          longitude: commandeResult.rows[0].boutique_longitude,
          createdAt: commandeResult.rows[0].boutique_createdAt,
          statut: commandeResult.rows[0].boutique_statut,
          tel: commandeResult.rows[0].boutique_tel,
          email: commandeResult.rows[0].boutique_email,
          logo: commandeResult.rows[0].boutique_logo,
        },
        elements: elementsResult.rows,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch commande details',
        error.message,
      );
    }
  }
}
