import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';
import { CreateTypeServiceDto } from '../dto/create-type-service.dto';

@Injectable()
export class TypeServiceService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page , limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT * FROM type_service ORDER BY id DESC`;
    const data = await this.dbUtil.walletServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      icon_url: row.code,
    }));
    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
  }
  async create(typeService: CreateTypeServiceDto): Promise<any> {
    const query = `INSERT INTO type_service (libelle, code) VALUES ($1, $2) RETURNING *`;
    const params = [typeService.libelle, typeService.code];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM type_service WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, typeService: any): Promise<any> {
    const query = `UPDATE type_service SET libelle = $1, code = $2 WHERE id = $3 RETURNING *`;
    const params = [typeService.libelle, typeService.code, id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM type_service WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.walletServiceQuery(query, params);
    return data.rows[0];
  }
}
