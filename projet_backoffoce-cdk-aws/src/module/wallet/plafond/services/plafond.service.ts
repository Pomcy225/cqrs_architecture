import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CreatePlafondDto } from '../dto/plafond.dto';

@Injectable()
export class PlafondService {
  constructor(private dbUtil: DBUtil) {}

  /**
   * Récupérer tous les plafonds avec pagination
   */
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const query = `
      SELECT 
        p.id, p.montant, p.type_plafond, p.createdAt, p.updatedAt, p.deletedAt,
        prov.id AS provider_id, prov.libelle AS provider_libelle, prov.code AS provider_code,
        ts.id AS type_service_id, ts.libelle AS type_service_libelle,
        ta.id AS type_action_id, ta.libelle AS type_action_libelle, ta.code AS type_action_code
      FROM plafond p
      INNER JOIN provider prov ON prov.id = p.provider_id
      INNER JOIN type_service ts ON ts.id = p.type_service_id
      INNER JOIN type_action ta ON ta.id = p.type_action_id
      ORDER BY p.id DESC;
    `;

    try {
      const data = await this.dbUtil.walletServiceQuery(query);
      const formattedData = data.rows.map((row) => ({
        id: row.id,
        montant: row.montant,
        type_plafond: row.type_plafond,
        provider: {
          id: row.provider_id,
          libelle: row.provider_libelle,
          code: row.provider_code,
        },
        type_service: {
          id: row.type_service_id,
          libelle: row.type_service_libelle,
        },
        type_action: {
          id: row.type_action_id,
          libelle: row.type_action_libelle,
          code: row.type_action_code,
        },
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        deletedAt: row.deletedAt,
      }));

      if (paginationDto.page && paginationDto.limit) {
        return paginate(formattedData, page, limit);
      }
      return formattedData;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch plafonds');
    }
  }

  /**
   * Créer un nouveau plafond
   */
  async create(plafond: CreatePlafondDto): Promise<any> {
    const createdAt = new Date();
    const updatedAt = new Date();
    const query = `
      INSERT INTO plafond (montant, type_plafond, provider_id, type_service_id, type_action_id, createdAt, updatedAt) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
    `;

    const params = [
      plafond.montant,
      plafond.type_plafond,
      plafond.provider_id,
      plafond.type_service_id,
      plafond.type_action_id,
      createdAt,
      updatedAt,
    ];

    try {
      const data = await this.dbUtil.walletServiceQuery(query, params);
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException('Failed to create plafond');
    }
  }

  /**
   * Récupérer un plafond par son ID
   */
  async getOne(id: number): Promise<any> {
    const query = `
      SELECT 
        p.id, p.montant, p.type_plafond, p.createdAt, p.updatedAt, p.deletedAt,
        prov.id AS provider_id, prov.libelle AS provider_libelle, prov.code AS provider_code,
        ts.id AS type_service_id, ts.libelle AS type_service_libelle,
        ta.id AS type_action_id, ta.libelle AS type_action_libelle, ta.code AS type_action_code
      FROM plafond p
      INNER JOIN provider prov ON prov.id = p.provider_id
      INNER JOIN type_service ts ON ts.id = p.type_service_id
      INNER JOIN type_action ta ON ta.id = p.type_action_id
      WHERE p.id = $1;
    `;

    try {
      const data = await this.dbUtil.walletServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Plafond with ID ${id} not found`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch plafond');
    }
  }

  /**
   * Mettre à jour un plafond
   */
  async update(id: number, plafond: any): Promise<any> {
    const updatedAt = new Date();
    const query = `
      UPDATE plafond 
      SET montant = $1, type_plafond = $2, provider_id = $3, type_service_id = $4, type_action_id = $5, updatedAt = $6 
      WHERE id = $7 
      RETURNING *;
    `;

    const params = [
      plafond.montant,
      plafond.type_plafond,
      plafond.provider_id,
      plafond.type_service_id,
      plafond.type_action_id,
      updatedAt,
      id,
    ];

    try {
      const data = await this.dbUtil.walletServiceQuery(query, params);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Plafond with ID ${id} not found`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException('Failed to update plafond');
    }
  }

  /**
   * Supprimer un plafond par son ID
   */
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM plafond WHERE id = $1 RETURNING *;`;

    try {
      const data = await this.dbUtil.walletServiceQuery(query, [id]);
      if (data.rows.length === 0) {
        throw new NotFoundException(`Plafond with ID ${id} not found`);
      }
      return data.rows[0];
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete plafond');
    }
  }
}
