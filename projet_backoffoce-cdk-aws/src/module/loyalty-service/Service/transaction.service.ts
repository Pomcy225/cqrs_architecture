import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class TransactionService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer toutes les transactions
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 25 } = paginationDto;

    const query = `
    SELECT 
      t.id AS transaction_id,
      t.service_code,
      t.service_nom,
      t.type_transaction,
      t.date_transaction,
      t.montant,
      t.account_id,
      a.user_id AS account_user_id,
      a.statut AS account_statut,
      a.point AS account_point
    FROM transaction AS t
    INNER JOIN account AS a ON t.account_id = a.id
    ORDER BY a.id DESC
  `;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query);

      if (!data.rows || data.rows.length === 0) {
        throw new NotFoundException('Aucune transaction trouvée.');
      }

      // Récupération des données supplémentaires pour chaque transaction
      const transactions = await Promise.all(
        data.rows.map(async (row) => {
          const query2 = `
          SELECT *
          FROM users
          WHERE public_id = $1
        `;
          const userResult = await this.dbUtil.endUserServiceQuery(query2, [
            row.account_user_id,
          ]);

          return {
            transaction_id: row.transaction_id,
            service_code: row.service_code,
            service_nom: row.service_nom,
            type_transaction: row.type_transaction,
            date_transaction: row.date_transaction,
            montant: row.montant,
            account_id: row.account_id,
            account: {
              user_id: row.account_user_id,
              statut: row.account_statut,
              point: row.account_point,
            },
            user: userResult.rows[0] || null, // Gérer le cas où aucun utilisateur n'est trouvé
          };
        }),
      );

      // Retour avec pagination
      return paginate(transactions, page, limit);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des transactions.',
      );
    }
  }

  // Créer une transaction
  async create(createDto: CreateTransactionDto) {
    const query = `
      INSERT INTO transaction 
      (user_id, service_code, service_nom, type_transaction, date_transaction, montant, account_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const params = [
      createDto.user_id,
      createDto.service_code,
      createDto.service_nom,
      createDto.type_transaction,
      createDto.date_transaction,
      createDto.montant,
      createDto.account_id,
    ];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création de la transaction.',
      );
    }
  }

  // Récupérer une transaction par ID
  async getOne(id: number) {
    const query = `
      SELECT 
        t.*,
        a.user_id AS account_user_id,
        a.statut AS account_statut,
        a.point AS account_point
      FROM transaction AS t
      INNER JOIN account AS a ON t.account_id = a.id
      WHERE t.id = $1
    `;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération de la transaction.',
      );
    }
  }

  // Mettre à jour une transaction
  async update(id: number, updateDto) {
    const fields = Object.keys(updateDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE transaction 
      SET ${fields} 
      WHERE id = $1 
      RETURNING *
    `;
    const params = [id, ...Object.values(updateDto)];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour de la transaction.',
      );
    }
  }

  // Supprimer une transaction
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM transaction WHERE id = $1`;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rowCount === 0) {
        throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la suppression de la transaction.',
      );
    }
  }
}
