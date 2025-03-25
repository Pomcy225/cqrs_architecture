import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class TransactionsService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer les transactions avec filtres et pagination
  async findAll(paginationDto: PaginationDto, data: any): Promise<any> {
    try {
      const { page = 1, limit = 25 } = paginationDto;
      let query = `SELECT * FROM transaction_operation`;
      const params: any[] = [];
      const conditions: string[] = [];

      if (data.dateDebut && data.dateFin) {
        conditions.push(
          `date_transaction BETWEEN $${params.length + 1} AND $${params.length + 2}`,
        );
        params.push(data.dateDebut, data.dateFin);
      } else if (data.dateDebut) {
        conditions.push(`date_transaction >= $${params.length + 1}`);
        params.push(data.dateDebut);
      }

      if (data.type) {
        conditions.push(`transaction_type = $${params.length + 1}`);
        params.push(data.type);
      }

      if (data.numero) {
        conditions.push(`destination_phone_number = $${params.length + 1}`);
        params.push(data.numero);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      query += ` ORDER BY id DESC`;

      const result = await this.dbUtil.walletServiceQuery(query, params);
      return paginate(result.rows, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des transactions',
      );
    }
  }
}
