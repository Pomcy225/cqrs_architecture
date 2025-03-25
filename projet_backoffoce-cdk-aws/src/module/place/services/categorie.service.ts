import { Injectable } from '@nestjs/common';
import { DBUtil } from 'src/utils/db-utils';
import { CreateCategoriePlaceDto } from '../dto/create-categorie.dto';
import { PaginationDto } from 'src/utils/response_api/dto/pagination_dto';
import { paginate } from 'src/utils/response_api/pagination.helper';

@Injectable()
export class CategorieService {
  constructor(
    private dbUtil: DBUtil
  ) { }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto; // Valeurs par défaut

    // Requête pour récupérer les données
    const query = `SELECT * FROM categorie ORDER BY id DESC`;
    const data = await this.dbUtil.placeServiceQuery(query);

    // Transformation des données dans le format souhaité
    const formattedData = data.rows.map((row) => ({
      id: row.id,
      libelle: row.libelle,
      icon_url: row.icon_url,
    }));
       
    if (paginationDto.page && paginationDto.limit) {
      return paginate(formattedData, page, limit);
    }
return formattedData;
    // Appliquer la pagination

  }

  async create(categorie: CreateCategoriePlaceDto): Promise<any> {
    const query = `INSERT INTO categorie (libelle, icon_url) VALUES ($1, $2) RETURNING *`;
    const params = [categorie.libelle, categorie.icon_url];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }

  async getOne(id: number): Promise<any> {
    const query = `SELECT * FROM categorie WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }
  async update(id: number, categorie: any): Promise<any> {
    const query = `UPDATE categorie SET libelle = $1, icon_url = $2 WHERE id = $3 RETURNING *`;
    const params = [categorie.libelle, categorie.icon_url, id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }
  async delete(id: number): Promise<any> {
    const query = `DELETE FROM categorie WHERE id = $1`;
    const params = [id];
    const data = await this.dbUtil.placeServiceQuery(query, params);
    return data.rows[0];
  }

}
