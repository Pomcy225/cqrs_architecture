import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CreateProviderDto } from '../dto/create-provider.dto';

@Injectable()
export class ProviderService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT * FROM provider ORDER BY id DESC`;
    const data = await this.dbUtil.walletServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      code: row.code,
    }));
    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
  }
  async create(provider: CreateProviderDto): Promise<any> {
    const query = `INSERT INTO provider (libelle, code) VALUES ($1, $2) RETURNING *`;
    const params = [provider.libelle, provider.code];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM provider WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, provider: any): Promise<any> {
    const query = `UPDATE provider SET libelle = $1, code = $2 WHERE id = $3 RETURNING *`;
    const params = [provider.libelle, provider.code, id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM provider WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
}
