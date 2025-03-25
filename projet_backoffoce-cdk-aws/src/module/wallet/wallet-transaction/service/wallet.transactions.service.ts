import { Injectable, InternalServerErrorException, Query } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class WalletTransactionService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer les transactions avec filtres et pagination
  async findAll(paginationDto: PaginationDto, data: any): Promise<any> {
    try {
      const { page = 1, limit = 25 } = paginationDto;
      const param = [data.walletId];
      const queryUser = `SELECT * FROM wallet WHERE id = $1`;
      const res = await this.dbUtil.walletServiceQuery(queryUser, param);

      if (!res.rows.length) {
        throw new InternalServerErrorException(
          'Aucun portefeuille trouvé pour cet utilisateur.',
        );
      }

      const userId = res.rows[0].user_id;

      let query = `SELECT * FROM transaction_operation`;
      const params: any[] = [];
      const conditions: string[] = [];

      if (data.dateDebut && data.dateFin) {
        conditions.push(
          `transaction_date BETWEEN $${params.length + 1} AND $${params.length + 2}`,
        );
        params.push(data.dateDebut, data.dateFin);
      } else if (data.dateDebut) {
        conditions.push(`transaction_date >= $${params.length + 1}`);
        params.push(data.dateDebut);
      }

      if (userId) {
        conditions.push(`user_owner_id = $${params.length + 1}`);
        params.push(userId);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      query += ` ORDER BY id DESC`;

      const result = await this.dbUtil.walletServiceQuery(query, params);
      return paginate(result.rows, page, limit);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des transactions',
      );
    }
  }

  // Récupérer total des depots
  async totalWallet(userId: string): Promise<any> {
    try {
      const param = [userId];

      const queryRetraits = `SELECT SUM(montant) AS total 
      FROM transaction_operation 
      WHERE user_owner_id = $1 
      AND (transaction_type = 'retraitMobileMoney' 
      OR transaction_type = 'retraitCompteBancaire' 
      OR transaction_type = 'retraitCarteBancaire')`;

      const resRetraits = await this.dbUtil.walletServiceQuery(
        queryRetraits,
        param,
      );

      const queryDepots = `SELECT SUM(montant) AS total
      FROM transaction_operation 
      WHERE user_owner_id = $1 
      AND (transaction_type = 'depotMobileMoney' 
      OR transaction_type = 'depotCompteBancaire' 
      OR transaction_type = 'depotCarteBancaire')`;

      const resDepots = await this.dbUtil.walletServiceQuery(
        queryDepots,
        param,
      );

      const queryPaiements = `SELECT SUM(montant) AS total
      FROM transaction_operation 
      WHERE user_owner_id = $1 
      AND transaction_type = 'paiementServiceLeBedoo'`;

      const resPaiements = await this.dbUtil.walletServiceQuery(
        queryPaiements,
        param,
      );

      return {
        totalDepots: resDepots.rows[0].total ?? 0,
        totalRetraits: resRetraits.rows[0].total ?? 0,
        totalPaiements: resPaiements.rows[0].total ?? 0,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des transactions',
      );
    }
  }

  /*
  none,
  bToB,
  bToC,
  cToC,
  cToB,

  transfertMobileMoney,
  */

  // solde de chaque wallet

  async soldeWallet(userId: string): Promise<any> {
    try {
      const param = [userId];

      const query = `SELECT * FROM wallet WHERE user_id = $1 AND type_wallet = 'walletLeBedoo'`;
      const res = await this.dbUtil.walletServiceQuery(query, param);

      const query1 = `SELECT * FROM wallet WHERE user_id = $1 AND type_wallet = 'virtual'`;
      const res1 = await this.dbUtil.walletServiceQuery(query1, param);

      const query2 = `SELECT * FROM wallet WHERE user_id = $1 AND type_wallet = 'physical'`;
      const res2 = await this.dbUtil.walletServiceQuery(query2, param); // Correction ici

      return {
        walletLebedoo: res.rows.length > 0 ? (res.rows[0].solde ?? 0) : 0,
        walletVirtual: res1.rows.length > 0 ? (res1.rows[0].solde ?? 0) : 0,
        walletPhysical: res2.rows.length > 0 ? (res2.rows[0].solde ?? 0) : 0,
      };
    } catch (error) {
      console.error(
        `Erreur lors de la récupération du solde du wallet (userId: ${userId}):`,
        error,
      );
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du solde du wallet',
      );
    }
  }
}
