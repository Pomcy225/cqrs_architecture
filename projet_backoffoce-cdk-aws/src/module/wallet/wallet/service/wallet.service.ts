import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class WalletService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer les s avec filtres et pagination
  async getOne(userId: string): Promise<any> {
    try {
      const param = [userId];
      const query = `SELECT * FROM wallet WHERE user_id = $1 ORDER BY id DESC`;
      const result = await this.dbUtil.walletServiceQuery(query, param);

      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des wallets :', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des wallets',
      );
    }
  }
}
