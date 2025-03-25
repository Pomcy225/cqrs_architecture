import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class CommentaireService {
  constructor(private readonly dbUtil: DBUtil) {}
  // Valeurs par défaut

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const query = `
      SELECT c.*, b.libelle AS boutique_name 
      FROM commentaire c 
      JOIN boutique b ON c.boutique_id = b.id ORDER BY id DESC
    `;

    const data = await this.dbUtil.bedooMallServiceQuery(query);
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      auteur: row.auteur,
      contenu: row.contenu,
      statut: row.statut,
      date: row.date,
      boutique: {
          id: row.boutique_id,
        libelle: row.boutique_name,
      }
    }))
    return paginate(formattedData, page, limit);
  }

  // Inverser le statut d'un commentaire
  async toggleStatus(id: number): Promise<any> {
    const findQuery = `SELECT statut FROM commentaire WHERE id = $1`;
    const updateQuery = `
      UPDATE commentaire 
      SET statut = $2 
      WHERE id = $1 
      RETURNING *
    `;

    // Récupérer le statut actuel
    const findResult = await this.dbUtil.bedooMallServiceQuery(findQuery, [id]);
    if (findResult.rows.length === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const currentStatus = findResult.rows[0].statut;
    const newStatus = !currentStatus; // Inverse le statut

    // Mettre à jour le statut
    const updateResult = await this.dbUtil.bedooMallServiceQuery(updateQuery, [
      id,
      newStatus,
    ]);
    return updateResult.rows[0];
  }
}
