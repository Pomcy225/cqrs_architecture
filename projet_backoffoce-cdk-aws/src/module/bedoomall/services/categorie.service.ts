import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { DBUtil } from 'src/utils/db-utils';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class CategorieService {
  constructor(private dbUtil: DBUtil) {}

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { page = 1, limit = 10 } = paginationDto; // Valeurs par défaut

    const query = `SELECT * FROM categorie ORDER BY id DESC`;
    const data = await this.dbUtil.bedooMallServiceQuery(query);
    return paginate(data.rows, page, limit);
  }

  async create(categorie: CreateCategorieDto): Promise<any> {
    const query = `INSERT INTO categorie (libelle, icon) VALUES ($1, $2) RETURNING *`;
    const params = [categorie.libelle, categorie.icon];
    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    return result.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM categorie WHERE id = $1`;
    const params = [id];
    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    return result.rows[0];
  }
 async update(id: number, categorie: any): Promise<any> {
    const query = `UPDATE categorie SET libelle = $1, icon = $2 WHERE id = $3 RETURNING *`;
    const params = [categorie.libelle, categorie.icon, id];
    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    return result.rows[0];
  }
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM categorie WHERE id = $1`;
    const params = [id];
    const result = await this.dbUtil.bedooMallServiceQuery(query, params);
    return result.rows[0];
  }

 
}
