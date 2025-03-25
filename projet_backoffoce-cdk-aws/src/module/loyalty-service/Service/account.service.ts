import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateAccountDto, UpdateAccountDto } from '../dto/create-account.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class AccountService {
  constructor(private readonly dbUtil: DBUtil) {}

  // Récupérer tous les comptes
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

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

  // Créer un compte
  async create(createAccountDto: CreateAccountDto) {
    const query = `
      INSERT INTO account (user_id, statut, point)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const params = [
      createAccountDto.user_id,
      createAccountDto.statut,
      createAccountDto.point || 0, // Valeur par défaut pour `point`
    ];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création du compte.',
      );
    }
  }

  // Récupérer un compte par ID
  async getOne(id: number) {
    const query = `
      SELECT id, user_id, statut, point
      FROM account
      WHERE id = $1
    `;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé.`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du compte.',
      );
    }
  }

  // Mettre à jour un compte
  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const fields = Object.keys(updateAccountDto)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE account
      SET ${fields}
      WHERE id = $1
      RETURNING *
    `;
    const params = [id, ...Object.values(updateAccountDto)];

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, params);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé.`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour du compte.',
      );
    }
  }

  // Supprimer un compte
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM account WHERE id = $1`;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rowCount === 0) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé.`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du compte.',
      );
    }
  }

  // Inverser le statut d'un compte
  async toggleStatus(id: number) {
    const findQuery = `SELECT statut FROM account WHERE id = $1`;
    const updateQuery = `
      UPDATE account
      SET statut = $2
      WHERE id = $1
      RETURNING *
    `;

    try {
      // Récupérer le statut actuel
      const findResult = await this.dbUtil.loyaltyServiceQuery(findQuery, [id]);
      if (findResult.rows.length === 0) {
        throw new NotFoundException(`Compte avec ID ${id} non trouvé.`);
      }

      const currentStatus = findResult.rows[0].statut === 'true';
      const newStatus = currentStatus ? 'false' : 'true';

      // Mettre à jour le statut
      const data = await this.dbUtil.loyaltyServiceQuery(updateQuery, [
        id,
        newStatus,
      ]);
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour du statut du compte.',
      );
    }
  }

  async transactionAccount(id: number) {
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
    WHERE t.account_id = $1
    ORDER BY t.date_transaction DESC
  `;

    try {
      const data = await this.dbUtil.loyaltyServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(
          `Aucune transaction trouvée pour le compte avec ID ${id}.`,
        );
      }
      return data.rows;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération des transactions pour le compte avec ID ${id}.`,
      );
    }
  }
}
