import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CommandeCarteDto } from '../dto/Commande.Carte.dto';

@Injectable()
export class CartService {
  constructor(private readonly dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 25 } = paginationDto;

    const query = `
       SELECT 
    c.*, 
    CASE 
        WHEN d.commande_carte_id IS NOT NULL THEN TRUE 
        ELSE FALSE 
    END AS is_dispatched,
    l.id AS livreur_id,
    l.nom AS livreur_nom,
    l.prenoms AS livreur_prenoms,
    l.telephone AS livreur_telephone
FROM commande_carte c
LEFT JOIN dispatch d ON c.id = d.commande_carte_id
LEFT JOIN livreur l ON d.livreur_id = l.id
ORDER BY c.id DESC;
    `;

    const data = await this.dbUtil.endUserServiceQuery(query);
    return paginate(data.rows, page, limit);
  }

  async delete(id: number) {
    const query = `DELETE FROM commande_carte WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, commandeCarteDto: CommandeCarteDto) {
    const params = [
      id,
      commandeCarteDto.nom_livreur,
      commandeCarteDto.tel_livreur,
      commandeCarteDto.date_remise_carte,
      commandeCarteDto.date_livraison,
    ];
    const query = `UPDATE commande_carte SET nom_livreur = $2, tel_livreur = $3, date_remise_carte = $4, date_livraison = $5 WHERE id = $1 RETURNING *`;

    const data = await this.dbUtil.endUserServiceQuery(query, params);
    return data.rows[0];
  }
}
