import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateVilleDto } from '../dto/create-ville.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class VilleService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto; // Valeurs par défaut

    const query = `SELECT * FROM ville ORDER BY id DESC`;
    const data = await this.dbUtil.placeServiceQuery(query);
    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
    }));

    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
    return formattedData;
  }
  async create(ville: CreateVilleDto): Promise<any> {
    const query = `INSERT INTO ville (libelle) VALUES ($1) RETURNING *`;
    const params = [ville.libelle];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }
  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM ville WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, ville: any): Promise<any> {
    const query = `UPDATE ville SET libelle = $1 WHERE id = $2 RETURNING *`;
    const params = [ville.libelle, id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }

  async delete(id: number): Promise<any> {
    const query = `DELETE FROM ville WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }
}
